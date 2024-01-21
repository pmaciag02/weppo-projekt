const pool = require('./db');

function addToCart(req, res) {
    (async function () {
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

function showCart(req, res) {
    (async function () {
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
}

function placeOrder(req, res) {
    (async function () {
        try {
            var result = await pool.query(
                `SELECT SUM(price) AS final_price
                    FROM orders join products on userid = ${req.session.userid}
                        and orders.productid = products.id
                        and orders.status = 'in cart'`);
            await pool.query(`UPDATE orders SET status = 'ordered' WHERE userid = ${req.session.userid}`);
            res.render('cart', { login: req.session.valid, admin: req.session.admin, price:  result.rows[0].final_price, done: true });
        }
        catch (err) {
            console.log(err);
        }
    })();
}

function removeFromCart(req, res) {
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
}

module.exports = {addToCart, showCart, placeOrder, removeFromCart};
