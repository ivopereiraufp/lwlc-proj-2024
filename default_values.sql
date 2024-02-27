USE LWLC_proj_2024;

-- Insert random users
INSERT INTO users (username, full_name, email, phone_number, address, password, is_admin)
VALUES
('user123', 'John Doe', 'user123@example.com', 123456789, '123 Fake St', 'password123', 'false'),
('admin1', 'Admin One', 'admin1@example.com', 987654321, '456 Main St', 'adminpass', 'true');

-- Insert random products
INSERT INTO products (name, price, photo_link)
VALUES
('Pizza', 10.99, 'https://example.com/pizza.jpg'),
('Burger', 8.99, 'https://example.com/burger.jpg'),
('Pasta', 12.99, 'https://example.com/pasta.jpg'),
('Salad', 6.99, 'https://example.com/salad.jpg');

-- Insert random orders
INSERT INTO orders (user_id, status, time, description, total_price, payment_method)
VALUES
(1, 'confirmed', '12:30 PM', '1x Pizza, 2x Burger', 28.97, 'cash'),
(2, 'preparing', '1:45 PM', '2x Pasta', 25.98, 'card');

-- Insert products for orders
INSERT INTO orders_products (order_id, product_id, product_quantity, payment_method)
VALUES
(1, 1, 1, 'cash'),
(1, 2, 2, 'cash'),
(2, 3, 2, 'card');
