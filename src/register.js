const pool = require('./db');
const bcrypt = require('bcrypt');

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
                const hashedPassword = await bcrypt.hash(password, 10);
                await pool.query(`INSERT INTO users (username, password) VALUES ('${login}', '${hashedPassword}')`);
                res.render('signin', {login: req.session.valid, admin: req.session.admin, error: false, signed: true});
            }
        }
        catch (err) {
            console.log(err);
        }
    })();
}

module.exports = register;
