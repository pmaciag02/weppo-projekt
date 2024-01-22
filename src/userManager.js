const pool = require('./db');
const admin = require('./admin');
const bcrypt = require('bcrypt');

function viewUsers(req, res) {
    (async function () {
        try {
            const result = await pool.query('select * from users');
            res.render('manage-users', {login: req.session.valid, admin: req.session.admin, result: result, adminUserId: admin.userId});
        }
        catch (err) {
            console.log(err);
        }
    })();
}

function viewAddUser(req, res) {
    res.render('add-user', {error: false, loginAlreadyExists: false, login: req.session.valid, admin: req.session.admin, result: {}});
}

function addUser(req, res) {
    if (req.body.cancel) {
        res.redirect('/manage-users');
        return;
    }

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.render('add-user', {
            error: true, loginAlreadyExists: false, login: req.session.valid, admin: req.session.admin, result: {username, password}
        });
    } else {
        (async function () {
            try {
                const result = await pool.query(`SELECT id FROM users WHERE username='${username}'`);
                if (result.rows.length > 0) {
                    res.render('add-user', {
                        error: false, loginAlreadyExists: true, login: req.session.valid, admin: req.session.admin, result: {username, password}
                    });
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    await pool.query(`INSERT INTO users(username, password) VALUES ('${username}', '${hashedPassword}')`);
                    res.redirect('/manage-users');
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }
}

function viewEditUser(req, res) {
    (async function () {
        try {
            const id = req.params.id;
            if (id == admin.userId) {
                res.redirect('/manage-users');
                return;
            }

            const result = await pool.query(`SELECT username FROM users WHERE id=${id}`);
            res.render('edit-user', {
                error: false, loginAlreadyExists: false, login: req.session.valid, admin: req.session.admin, result: result.rows[0]
            });
        } catch (err) {
            console.log(err);
        }
    })();
}

function editUser(req, res) {
    if (req.body.cancel) {
        res.redirect('/manage-users');
        return;
    }

    const username = req.body.username;
    const password = req.body.password;

    if (!username) {
        res.render('edit-user', {
            error: true, loginAlreadyExists: false, login: req.session.valid, admin: req.session.admin, result: {username, password}
        });
    } else {
        (async function () {
            try {
                const id = req.params.id;
                if (id == admin.userId) {
                    res.redirect('/manage-users');
                    return;
                }

                const result = await pool.query(`SELECT id FROM users WHERE id<>${id} AND username='${username}'`);
                if (result.rows.length > 0) {
                    res.render('edit-user', {
                        error: false, loginAlreadyExists: true, login: req.session.valid, admin: req.session.admin, result: {username, password}
                    });
                } else {
                    if (password) {
                        const hashedPassword = await bcrypt.hash(password, 10);
                        await pool.query(`UPDATE users SET username='${username}', password='${hashedPassword}' WHERE id=${id}`);
                    } else {
                        await pool.query(`UPDATE users SET username='${username}' WHERE id=${id}`);
                    }
                    res.redirect('/manage-users');
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }
}

function deleteUser(req, res) {
    (async function () {
        try {
            const id = req.params.id;
            if (id == admin.userId) {
                res.redirect('/manage-users');
                return;
            }

            await pool.query(`DELETE FROM users where id = ${id}`);
            res.redirect('/manage-users');
        }
        catch (err) {
            console.log(err);
        }
    })();
}

module.exports = {
    viewUsers,
    viewAddUser,
    addUser,
    viewEditUser,
    editUser,
    deleteUser};
