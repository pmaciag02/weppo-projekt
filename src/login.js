const pool = require('./db')

// admin
const adminUsername = 'admin';
const adminPassword = 'admin';
const adminUserId = -1;

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
    if (username == adminUsername) {
        if (password == adminPassword) {
            setUpLoggedSession(req.session, username, adminUserId, true);
            res.redirect('/');
        }
        else {
            res.render('login', {error: true, admin: req.session.admin, login: req.session.valid});
        }
    }

    (async function main() {
        try {
            const result = await pool.query(`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`);

            if (result.rows.length > 0) {
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

module.exports = login;
