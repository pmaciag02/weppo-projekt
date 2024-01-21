const pool = require('./db');

function showOrders(req, res) {
    (async function () {
        try {
            var userids = await pool.query('select id from users');
            var result = [];
            for(let i = 0; i < userids.rows.length; i++) {
                var orders = await pool.query(`select * from orders join products on orders.productid = products.id where userid = ${userids.rows[i].id}`);
                result.push(orders);
            }
            res.render('orders', { login: req.session.valid, admin: req.session.admin, result: result });
        }
        catch (err) {
            console.log(err);
        }
    })();
}

module.exports = showOrders;
