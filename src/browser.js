const pool = require('./db');

function browserDefaultView(req, res) {
    res.render('browse', {anyresult: false, admin: req.session.admin, login: req.session.valid, data: ''});
}

function showResults(req, res) {
    const data = req.body.data.toString();
    (async function main() {
        try {
            const result = await pool.query(`select * from products where name like '%${data}%' or description like '%${data}%'`);
            res.render('browse', {anyresult: true, result: result, admin: req.session.admin, login: req.session.valid, data: data});
        }
        catch (err) {
            console.log(err);
        }
    })();
}

module.exports = {browserDefaultView, showResults};
