const express        = require('express');
const cookieParser   = require('cookie-parser');
const session        = require('express-session');
const authorize      = require('./src/authorize');
const pool           = require('./src/db')
const login          = require('./src/login');
const register       = require('./src/register');
const authenticate   = require('./src/authenticate');
const productManager = require('./src/productManager');
const userManager    = require('./src/userManager');
const browser        = require('./src/browser');

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

// browser
app.get('/szukaj', browser.browserDefaultView);
app.post('/szukaj', browser.showResults);

// cart
app.get('/zakup/:id', authenticate('user'), function (req, res) {
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

app.get('/koszyk', authenticate('user'), (req, res) => {
    (async function main() {
        try {
            var result = await pool.query(`select * from orders join products on userid = '${req.session.userid}'
                                                    and orders.productid = products.id
                                                    and orders.status = 'in cart'`);
            res.render('cart', { login: req.session.valid, admin: req.session.admin, result: result, done: false });
        }
        catch (err) {
            console.log(err);
        }
    })();
});

app.get('/koszyk-zamow', function (req, res) {
    (async function main() {
        try {
            var result = await pool.query(`SELECT SUM(price) AS final_price FROM orders join products on userid = ${req.session.userid} and orders.productid = products.id and orders.status = 'in cart'`);
            // await pool.query(`DELETE FROM orders WHERE userid = ${req.session.userid}`);
            await pool.query(`UPDATE orders SET status = 'ordered' WHERE userid = ${req.session.userid}`);
            res.render('cart', { login: req.session.valid, admin: req.session.admin, price:  result.rows[0].final_price, done: true });
        }
        catch (err) {
            console.log(err);
        }
    })();
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

// login
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

// admin functions
// manage products
app.get('/manage-products', authenticate('admin'), productManager.viewProducts);

app.get('/dodaj-produkt', authenticate('admin'), productManager.viewAddProduct);
app.post('/dodaj-produkt', authenticate('admin'), productManager.addProduct);

app.get('/edytuj-produkt/:id', authenticate('admin'), productManager.viewEditProduct);
app.post('/edytuj-produkt/:id', authenticate('admin'), productManager.editProduct);

app.get('/usun-produkt/:id', authenticate('admin'), productManager.deleteProduct);

// manage users
app.get('/manage-users', authenticate('admin'), userManager.viewUsers);

app.get('/dodaj-uzytkownik', authenticate('admin'), userManager.viewAddUser);
app.post('/dodaj-uzytkownik', authenticate('admin'), userManager.addUser);

app.get('/edytuj-uzytkownik/:id', authenticate('admin'), userManager.viewEditUser);
app.post('/edytuj-uzytkownik/:id', authenticate('admin'), userManager.editUser);

app.get('/usun-uzytkownik/:id', authenticate('admin'), userManager.deleteUser);

// unsupported route
app.use((req, res, next) => {
    res.status(404).render('404', { url : req.url});
});

app.listen(port, () => console.log(`Server started on port ${port}`));
