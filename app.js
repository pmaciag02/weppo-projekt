const express        = require('express');
const cookieParser   = require('cookie-parser');
const session        = require('express-session');
const showProducts   = require('./src/showProducts')
const browser        = require('./src/browser');
const authenticate   = require('./src/authenticate');
const cart           = require('./src/cart');
const login          = require('./src/login');
const register       = require('./src/register');
const productManager = require('./src/productManager');
const userManager    = require('./src/userManager');
const showOrders     = require('./src/showOrders');

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

// show products
app.get('/produkty', showProducts);

// browser
app.get('/szukaj', browser.browserDefaultView);
app.post('/szukaj', browser.showResults);

// cart
app.get('/zakup/:id', authenticate('user'), cart.addToCart);
app.get('/koszyk', authenticate('user'), cart.showCart);
app.get('/koszyk-zamow', authenticate('user'), cart.placeOrder);
app.get('/koszyk-usun/:id', authenticate('user'), cart.removeFromCart);

// login
app.get('/login', function (req, res) {
    res.render('login', {error: false, admin: req.session.admin, login: req.session.valid});
});

app.post('/login', login);

// register
app.get('/register', function (req, res) {
    res.render('signin', {
        login: req.session.valid,
        admin: req.session.admin,
        error: false,
        signed: false,
        admin: req.session.admin,
        login: req.session.valid});
});

app.post('/register', register);

// logout
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

// show orders
app.get('/show-orders', authenticate('admin'), showOrders);

// unsupported route
app.use((req, res, next) => {
    res.status(404).render('404', { url : req.url});
});

// start server
app.listen(port, () => console.log(`Server started on port ${port}`));
