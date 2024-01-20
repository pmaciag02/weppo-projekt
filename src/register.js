const pool = require('./db')

function register(req, res) {
    let login = req.body.login.toString();
    let password = req.body.password.toString();

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
}

module.exports = register;
