const express        = require('express');
const cookieParser   = require('cookie-parser');
const session        = require('express-session');
const authorize      = require('./src/authorize');
const pool           = require('./src/db')
const login          = require('./src/login');
const register       = require('./src/register');
const authenticate   = require('./src/authenticate')

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

// Routes
app.get('/', (req, res) => {
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

app.get('/szukaj', function (req, res) {
    res.render('browse', {anyresult:false, admin: req.session.admin, login: req.session.valid});
});

app.post('/szukaj', function (req, res) {
    let data = req.body.data.toString();
    (async function main() {
        try {
            var result = await pool.query(`select * from products where name = '${data}' or description = '${data}'`);
            res.render('browse', {anyresult:true, result:result, admin: req.session.admin, login: req.session.valid});
        }
        catch (err) {
            console.log(err);
        }
    })();
});

app.get('/zakup/:id', authenticate('user'), function (req, res) {
    if (req.session.admin) {
        res.redirect('/')
    } else {
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
    }
});

app.get('/koszyk', authenticate('user'), (req, res) => {
    if (req.session.admin) {
        res.redirect('/');
    } else {
        (async function main() {
            try {
                var result = await pool.query(`select * from orders join products on userid = '${req.session.userid}'
                                                        and orders.productid = products.id
                                                        and orders.status = 'in cart'`);
                res.render('cart', { login: req.session.valid, admin: req.session.admin, result: result });
            }
            catch (err) {
                console.log(err);
            }
        })();
    }
});

app.get('/koszyk-usun/:id', authenticate('user'), function (req, res) {
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

app.post('/login', login);

app.get('/register', function (req, res) {
    res.render('signin', {login: req.session.valid, admin: req.session.admin, error: false, signed: false, admin: req.session.admin, login: req.session.valid});
});

app.post('/register', register);

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
});

app.get('/manage-products', authenticate('admin'), (req, res) => {
    (async function main() {
        try {
            var result = await pool.query('select * from products');
            res.render('manage-products', { login: req.session.valid, admin: req.session.admin, result: result });
        }
        catch (err) {
            console.log(err);
        }
    })();
});

app.get('/manage-users', authenticate('admin'), (req, res) => {
    (async function main() {
        try {
            var result = await pool.query('select * from users');
            res.render('manage-users', { login: req.session.valid, admin: req.session.admin, result: result });
        }
        catch (err) {
            console.log(err);
        }
    })();
});

app.use((req, res, next) => {
    res.status(404).render('404', { url : req.url});
});

app.listen(port, () => console.log(`Server started on port ${port}`));
