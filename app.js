// npm install ejs --save
// npm install express --save
// npm install express-session --save
// npm install cookie-parser --save
// npm install multer --save

var http = require('http');
// let createError = require('http-errors');
var express = require('express');

var cookieParser = require('cookie-parser');

var session = require('express-session');

var authorize = require('./authorize');

var pg = require('pg');

var multer = require('multer');

// let path = require('path');
// var session = require('express-session');
// let logger = require('morgan');

// let indexRouter = require('./views/index.ejs');
// let indexRouter = require('./routes/index');
// let usersRouter = require('./routes/users');
// let loginRouter = require('./routes/login');
// let registerRouter = require('./routes/register');
// let productsRouter = require('./routes/products');
// let cartRouter = require('./routes/cart');
// let ordersRouter = require('./routes/orders');

var app = express();
var upload = multer();

// app.locals.moment = require('moment');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./static'));

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use(session({
//     secret: '654af64asd46w3',
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 2 * 60 * 60 * 1000 }
// }))

// app.use(cookieParser('456dasd63adaw56das3'))

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('sgs90890s8g90as8rg90as8g9r8a0srg8'));

app.disable('etag');
app.use(session({resave:true, saveUninitialized: true, secret: 'qewhiugriasgy'}));


var pool = new pg.Pool({
    host: 'localhost',
    database: 'database',
    user: 'postgres',
    password: 'postgres'
});


app.get( '/', (req, res) => {
    res.render('index', {login: req.session.valid, admin: req.session.admin});
});

app.get('/produkty', (req, res) => {
    (async function main() {
        // var pool = new pg.Pool({
        //     host: 'localhost',
        //     database: 'database',
        //     user: 'postgres',
        //     password: 'postgres'
        // });
        try {
            var result = await pool.query('select * from products');
            res.render('products', { login: req.session.valid, admin: req.session.admin, result: result });
        }
        catch (err) {
            console.log(err);
        }
    })();
});



// app.get('/zarejestruj', (req, res) => {
//     res.render('signin');
// });

// app.use('/zarejestruj', (req, res) => {
//     var sessionValue;
//     if (!req.session.sessionValue) {
//         sessionValue = new Date().toString();
//         req.session.sessionValue = sessionValue;
//     } else {
//         sessionValue = req.session.sessionValue;
//     }
//     res.render('signin', { sessionValue: sessionValue } );
// });



function authenticate(req, res, next) {
    if (req.session.valid) {
        next();
    }
    else {
        res.send('Funkcja dostępna tylko dla zalogowanych');
    }
}





app.get('/zakup/:id', authenticate, function (req, res) {
    (async function main() {
        try {
            var id = req.param('id');
            var result = await pool.query("SELECT MAX(orderid) as maxid FROM orders");

            // console.log(result.rows[0].maxid);
            // var newid = result.rows[0].maxid + 1;
            // console.log(newid);
            await pool.query(`INSERT INTO orders (status, userid, productid) VALUES ('in cart', ${req.session.userid}, ${id})`);
            res.redirect('/koszyk');
        }
        catch (err) {
            console.log(err);
        }
    })();

});

app.get('/koszyk', authenticate, (req, res) => {
    (async function main() {
        try {
            var result = await pool.query(`select * from orders join products on userid = '${req.session.userid}' and orders.productid = products.id and orders.status = 'in cart'`);
            res.render('cart', { login: req.session.valid, admin: req.session.admin, result: result });
        }
        catch (err) {
            console.log(err);
        }
    })();
});


app.get('/koszyk-usun/:id', authenticate, function (req, res) {
    (async function main() {
        try {
            var id = req.param('id');
            await pool.query(`DELETE FROM orders where orderid = ${id}`);
            res.redirect('/koszyk');
        }
        catch (err) {
            console.log(err);
        }
    })();

});


app.get('/login', function (req, res) {
    res.render('login', {error: false, admin: req.session.admin, login: req.session.valid});

});

app.post('/login', function (req, res) {
    let login = req.body.login.toString();
    let password = req.body.password.toString();
    // console.log(login, password)

    // console.log("SELECT * FROM users WHERE username = \'" + login + "\' AND password = \'" + password + "\'");
    (async function main() {
        try {
            var result = await pool.query("SELECT * FROM users WHERE username = \'" + login + "\' AND password = \'" + password + "\'");

            if (result.rows.length > 0) {
                console.log(`${result.rows[0].id} ${result.rows[0].username} ${result.rows[0].password}`);
                // let hashedPassword = result.dataValues.password;
                // bcrypt.compare(password, hashedPassword, function (err, x) {
                    // if (x) {
                        req.session.user = login;
                        req.session.userid = result.rows[0].id;
                        // req.session.admin = result.body.admin;
                        req.session.valid = true;
                        req.session.cart = {};
                        req.session.price = 0;
                        res.redirect('/');
                    // }
                    // else {
                        // res.render('login', {error: true, admin: req.session.admin, login: req.session.valid})
                    // }
                // });
            }
            else {
                res.render('login', {error: true});
            }
        }
        catch (err) {
            console.log(err);
        }
    })();

});


app.get('/register', function (req, res) {
    res.render('signin', {login: req.session.valid, admin: req.session.admin, error: false, signed: false, admin: req.session.admin, login: req.session.valid});
});



app.post('/register', function (req, res) {
    let login = req.body.login.toString();
    let password = req.body.password.toString();
    // console.log(login, password)

    // console.log("SELECT * FROM users WHERE username = \'" + login + "\' AND password = \'" + password + "\'");
    (async function main() {
        try {
            var result = await pool.query("SELECT * FROM users WHERE username = \'" + login + "\'");

            if (result.rows.length > 0) {
                res.render('signin', {login: req.session.valid, admin: req.session.admin, error: true, signed: false});
            }
            else {
                await pool.query(`INSERT INTO users (username, password) VALUES ('${login}', '${password}')`);
                res.render('signin', {login: req.session.valid, admin: req.session.admin, error: false, signed: true});
            }
        }
        catch (err) {
            console.log(err);
        }
    })();

});

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/login', loginRouter);
// app.use('/register', registerRouter);
// app.use('/product', productsRouter);
// app.use('/cart', cartRouter);
// app.use('/orders', ordersRouter);

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
});


// app.use(express.static("./static"));

// app.use('/', indexRouter);

app.use((req, res, next) => {
    res.status(404).render('404', { url : req.url});
});

// app.use((req,res,next) => {
//     res.render('404.ejs', { url : req.url });
// });

http.createServer(app).listen(3000);
// http.createServer(app).listen(process.env.PORT || 3000);