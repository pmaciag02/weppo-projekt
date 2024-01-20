const express      = require('express');
const cookieParser = require('cookie-parser');
const session      = require('express-session');
const authorize    = require('./authorize');
const pg           = require('pg');

// Express setup
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./static'));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('sgs90890s8g90as8rg90as8g9r8a0srg8'));

app.disable('etag');
app.use(session({resave:true, saveUninitialized: true, secret: 'qewhiugriasgy'}));

const port = 3000;

// DB setup
const pool = new pg.Pool({
    host: 'db',
    port: 5432,
    user: 'user123',
    password: 'password123',
    database: 'db123'
});

// Routes
app.get( '/', (req, res) => {
    res.render('index', {login: req.session.valid, admin: req.session.admin});
});

app.get('/produkty', (req, res) => {
    (async function main() {
        try {
            var result = await pool.query('select * from products');
            res.render('products', { login: req.session.valid, admin: req.session.admin, result: result });
        }
        catch (err) {
            console.log(err);
        }
    })();
});

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

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
});

app.use((req, res, next) => {
    res.status(404).render('404', { url : req.url});
});

app.listen(port, () => console.log(`Server started on port ${port}`));
