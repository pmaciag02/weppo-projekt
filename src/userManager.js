const pool = require('./db');

function viewUsers(req, res) {
    (async function () {
        try {
            const result = await pool.query('select * from users');
            res.render('manage-users', {login: req.session.valid, admin: req.session.admin, result: result });
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
                    await pool.query(`INSERT INTO users(username, password) VALUES ('${username}', '${password}')`);
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
            result = await pool.query(`SELECT * FROM users WHERE id=${id}`);
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

    if (!username || !password) {
        res.render('edit-user', {
            error: true, loginAlreadyExists: false, login: req.session.valid, admin: req.session.admin, result: {username, password}
        });
    } else {
        (async function () {
            try {
                const id = req.params.id;
                const result = await pool.query(`SELECT id FROM users WHERE id<>${id} AND username='${username}'`);
                if (result.rows.length > 0) {
                    res.render('edit-user', {
                        error: false, loginAlreadyExists: true, login: req.session.valid, admin: req.session.admin, result: {username, password}
                    });
                } else {
                    await pool.query(`UPDATE users SET username='${username}', password='${password}' WHERE id=${id}`);
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
