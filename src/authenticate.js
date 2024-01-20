function authenticate(type='user'){
    return function (req, res, next) {
        let check = req.session.valid;
        if (type == 'admin') {
            check = check && req.session.admin
        }

        if (check) {
            next();
        }
        else {
            res.send('Funkcja dostępna tylko dla zalogowanych');
        }
    }
}

module.exports = authenticate;
