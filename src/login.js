const pool = require('./db');
const admin = require('./admin');
const bcrypt = require('bcrypt');

function setUpLoggedSession(session, username, userId, isAdmin=false) {
    session.username = username;
    session.userid = userId;
    session.valid = true;
    session.admin = isAdmin;
}

function login(req, res) {
    const username = req.body.login.toString();
    const password = req.body.password.toString();

    // check if user is admin
    if (username == admin.username) {
        if (password == admin.password) {
            setUpLoggedSession(req.session, username, admin.userId, true);
            res.redirect('/');
        }
        else {
            res.render('login', {error: true, admin: req.session.admin, login: req.session.valid});
        }
    } else {
        (async function main() {
            try {
                const result = await pool.query(`SELECT id, password FROM users WHERE username = '${username}'`);

                if (result.rows.length == 1 && await bcrypt.compare(password, result.rows[0].password)) {
                    setUpLoggedSession(req.session, username, result.rows[0].id);
                    res.redirect('/');
                }
                else {
                    res.render('login', {error: true, admin: req.session.admin, login: req.session.valid});
                }
            }
            catch (err) {
                console.log(err);
            }
        })();
    }
}

module.exports = login;
