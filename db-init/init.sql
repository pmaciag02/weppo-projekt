CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL
);

INSERT INTO users VALUES (0, 'admin', 'hasloadmina');

INSERT INTO users (username, password) VALUES
    ('login1', 'haslo1'),
    ('login2', 'haslo2'),
    ('login3', 'haslo3');


CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description VARCHAR(100) NOT NULL
);


INSERT INTO products (name, price, description) VALUES
  ('Produkt 1', 5.99, 'Bardzo fajny produkt.'),
  ('Produkt 2', 420.69, 'Ekstra fajny produkt.'),
  ('Produkt 3', 99.99, 'Super fajny produkt.');


CREATE TABLE orders (
    orderid SERIAL PRIMARY KEY,
    status VARCHAR(10) NOT NULL,
    userid INT NOT NULL,
    productid INT NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (productid) REFERENCES products(id) ON DELETE CASCADE
);
