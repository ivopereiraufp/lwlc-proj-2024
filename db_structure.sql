CREATE DATABASE IF NOT EXISTS LWLC_proj_2024;

USE LWLC_proj_2024;

-- Structure of the "users" table
CREATE TABLE IF NOT EXISTS users (
                                     user_id INT PRIMARY KEY AUTO_INCREMENT,
                                     username VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number INT UNSIGNED UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin ENUM('true', 'false') NOT NULL
    );

-- Structure of the "orders" table
CREATE TABLE IF NOT EXISTS orders (
                                      order_id INT PRIMARY KEY AUTO_INCREMENT,
                                      user_id INT,
                                      status VARCHAR(255) NOT NULL,
    time VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    total_price INT UNSIGNED NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

-- Structure of the "products" table
CREATE TABLE IF NOT EXISTS products (
                                        product_id INT PRIMARY KEY AUTO_INCREMENT,
                                        name VARCHAR(255) UNIQUE NOT NULL,
    price INT UNSIGNED NOT NULL,
    photo_link VARCHAR(255) UNIQUE
    );

-- Structure of the "orders_products" table
CREATE TABLE IF NOT EXISTS orders_products (
                                               many_to_many_id INT PRIMARY KEY AUTO_INCREMENT,
                                               order_id INT,
                                               product_id INT,
                                               FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    product_quantity INT UNSIGNED NOT NULL,
    payment_method VARCHAR(50) NOT NULL
    );
