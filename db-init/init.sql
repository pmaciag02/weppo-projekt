CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(100) NOT NULL
);

INSERT INTO users VALUES (0, 'admin', 'hasloadmina');

INSERT INTO users (username, password) VALUES
    ('login1', '$2b$10$JAcMjh5si3o8ZtuWf44FmOuEBUJnNHEuC0M1RPitF5.OEDC2oJuVy'),
    ('login2', '$2b$10$bc.HCRquE1FxvX5XyRIwk.5ymub0dh0x5dWtotDoc12DiwQWHQyWS'),
    ('login3', '$2b$10$yemDu308rGgtJyIoO6eEw.TVnG3c0dUQz6LK3sLyIZ8OMjFvM4pju');


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
