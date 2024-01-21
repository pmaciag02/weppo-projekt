const pool = require('./db')

function register(req, res) {
    const login = req.body.login.toString();
    const password = req.body.password.toString();

    if (!login || !password) {
        res.render('signin', {login: req.session.valid, admin: req.session.admin, error: 'empty', signed: false});
        return;
    }

    (async function main() {
        try {
            var result = await pool.query("SELECT * FROM users WHERE username = \'" + login + "\'");

            if (result.rows.length > 0) {
                res.render('signin', {login: req.session.valid, admin: req.session.admin, error: 'taken', signed: false});
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
}

module.exports = register;
