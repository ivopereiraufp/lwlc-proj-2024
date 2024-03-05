USE LWLC_proj_2024;

-- Insert random users
INSERT INTO users (username, full_name, email, phone_number, address, password, is_admin)
VALUES
('john_doe', 'John Doe', 'john@example.com', 123456789, '123 Main St, City, Country', 'password123', 'false'),
('jane_smith', 'Jane Smith', 'jane@example.com', 987654321, '456 Elm St, City, Country', 'password456', 'false'),
('admin_user', 'Admin User', 'admin@example.com', 123454321, '456 Maple St, City, Country', 'adminpassword', 'true');

-- Insert random products
INSERT INTO products (name, price, photo_link)
VALUES
('Smartphone', 999, 'https://example.com/smartphone.jpg'),
('Laptop', 1999, 'https://example.com/laptop.jpg'),
('Headphones', 99, 'https://example.com/headphones.jpg'),
('Tablet', 499, 'https://example.com/tablet.jpg'),
('Smartwatch', 299, 'https://example.com/smartwatch.jpg'),
('Wireless Mouse', 59, 'https://example.com/mouse.jpg');

-- Insert random orders
INSERT INTO orders (user_id, status, date_time, description, total_price, payment_method)
VALUES
(1, 'pending', '2024-02-28 09:00:00', '1x Smartphone, 2x Headphones', 1197, 'credit card'),
(2, 'pending', '2024-02-28 10:30:00', '1x Laptop', 1999, 'paypal'),
(3, 'pending', '2024-02-28 11:45:00', '1x Tablet, 1x Wireless Mouse', 558, 'credit card'),
(1, 'pending', '2024-02-28 12:30:00', '2x Smartwatch', 598, 'paypal'),
(2, 'processing', '2024-02-28 14:15:00', '1x Tablet', 499, 'credit card'),
(3, 'shipped', '2024-02-28 15:30:00', '3x Smartwatch', 897, 'paypal'),
(1, 'delivered', '2024-02-28 16:45:00', '2x Wireless Mouse', 118, 'cash');

-- Insert products for orders
INSERT INTO orders_products (order_id, product_id, product_quantity, payment_method)
VALUES
(1, 1, 1, 'credit card'),
(1, 3, 2, 'credit card'),
(2, 2, 1, 'paypal'),
(3, 4, 1, 'credit card'),
(3, 6, 1, 'credit card'),
(4, 5, 2, 'paypal'),
(5, 4, 1, 'credit card'),
(6, 5, 3, 'paypal'),
(7, 6, 2, 'cash');
