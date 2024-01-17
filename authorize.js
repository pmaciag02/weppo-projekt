/**
*
* @param {http.IncomingMessage} req
* @param {http.ServerResponse} res
* @param {*} next
*/
const clients = [
    { id: 1, username: 'klient', password: 'haslo' },
    // Dodaj więcej klientów w razie potrzeby
  ];
  
  const admins = [
    { id: 1, username: 'admin', password: 'hasloAdmina' },
    // Dodaj więcej adminów w razie potrzeby
  ];

function authorize(type) {

    if (type === 'client') {
        return function client_authorize(req, res, next) {
            // Sprawdź, czy klient istnieje w bazie danych
    const client = clients.find(client => client.username === username && client.password === password);
  
    if (client) {
      req.session.user = client;
      next();
    } else {
        res.redirect('/login?returnUrl='+req.url);
    //   res.status(401).send('Nieprawidłowe dane uwierzytelniające dla klienta.');
    }
        };
    }
    else if (type === 'admin') {
        return function admin_authorize(req, res, next) {
            if ( req.signedCookies.user ) {
                req.user = req.signedCookies.user;
                next();
            } else {
                res.redirect('/login?returnUrl='+req.url);
            }
        };
    }
    else {

    }
}

module.exports = authorize;