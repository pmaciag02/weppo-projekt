const pool = require('./db');

function showProducts(req, res) {
    (async function () {
        try {
            var result = await pool.query('select * from products');
            res.render('products', { login: req.session.valid, admin: req.session.admin, result: result });
        }
        catch (err) {
            console.log(err);
        }
    })();
}

module.exports = showProducts;
