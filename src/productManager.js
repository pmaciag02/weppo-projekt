const pool = require('./db');

function viewProducts(req, res) {
    (async function () {
        try {
            const result = await pool.query('select * from products');
            res.render('manage-products', { login: req.session.valid, admin: req.session.admin, result: result });
        }
        catch (err) {
            console.log(err);
        }
    })();
}

function viewAddProduct(req, res) {
    res.render('add-product', {error: false, login: req.session.valid, admin: req.session.admin, result: {}});
}

function addProduct(req, res) {
    if (req.body.cancel) {
        res.redirect('/manage-products');
        return;
    }

    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;

    if (!name || !price) {
        res.render('add-product', {error: true, login: req.session.valid, admin: req.session.admin, result: {name, price, description}});
    } else {
        (async function () {
            try {
                await pool.query(`INSERT INTO products(name, price, description) VALUES ('${name}', ${price}, '${description}')`);
                res.redirect('/manage-products');
            } catch (err) {
                console.log(err);
            }
        })();
    }
}

function viewEditProduct(req, res) {
    (async function () {
        try {
            const id = req.params.id;
            result = await pool.query(`SELECT * FROM products WHERE id=${id}`);
            res.render('edit-product', {error: false, login: req.session.valid, admin: req.session.admin, result: result.rows[0]});
        } catch (err) {
            console.log(err);
        }
    })();
}

function editProduct(req, res) {
    if (req.body.cancel) {
        res.redirect('/manage-products');
        return;
    }

    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;

    if (!name || !price) {
        res.render('edit-product', {error: true, login: req.session.valid, admin: req.session.admin, result: {name, price, description}});
    } else {
        (async function () {
            try {
                const id = req.params.id;
                result = await pool.query(`UPDATE products SET name='${name}', price=${price}, description='${description}' WHERE id=${id}`);
                res.redirect('/manage-products');
            } catch (err) {
                console.log(err);
            }
        })();
    }
}

function deleteProduct(req, res) {
    (async function () {
        try {
            const id = req.params.id;
            await pool.query(`DELETE FROM products where id = ${id}`);
            res.redirect('/manage-products');
        }
        catch (err) {
            console.log(err);
        }
    })();
}

module.exports = {
    viewProducts,
    viewAddProduct,
    addProduct,
    viewEditProduct,
    editProduct,
    deleteProduct};
