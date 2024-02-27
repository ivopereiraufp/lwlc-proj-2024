const express = require("express");
const parser = require("body-parser");
//const cors = require("cors");
const sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const key = require("./shh");

const server = express();
//server.use(cors());
server.use(parser.json());
server.listen(3000, () => console.log("Server started"));
const sql = new sequelize("mysql://root:@localhost:3306/LWLC_proj_2024");
sql.authenticate().then(() => console.log("DB connected"));

//--------------------------------------------------------- MIDDLEWARES

// Middleware to authenticate administrator roles
function adminAuth(req, res, next) {
    /*const token = req.headers.authorization;
    if (!token) {
        return res.status(400).send("Authorization token not detected!");
    }
    try {
        const decodedToken = jwt.verify(token, key);
        const isAdmin = decodedToken.admin;
        if (isAdmin !== true) {
            return res.status(403).send("You don't have administrator privileges!");
        }
        next();
    } catch (error) {
        return res.status(401).send("Invalid token!");
    }*/
    next();
}

// Function to retrieve product details for a given order ID
async function getProductDetails(orderId) {
    try {
        const [product] = await sql.query(`
            SELECT op.product_id, op.product_quantity, p.name, p.price
            FROM orders_products AS op
            JOIN products AS p ON p.product_id = op.product_id
            WHERE op.order_id = "${orderId}"
        `);
        return product;
    } catch (error) {
        throw new Error("Error fetching product details: " + error.message);
    }
}


// Function to generate order info
async function orderInfo(productId, quantity) {
    try {
        const [product] = await sql.query(`SELECT name FROM products WHERE product_id = "${productId}"`);
        const productName = product[0].name;
        return `${quantity}x ${productName}`;
    } catch (error) {
        throw new Error("Error generating order info: " + error.message);
    }
}



//--------------------------------------------------------- ENDPOINTS
//----------------------- PRODUCTS

// Route to retrieve the list of products
server.get("/products", async function(req, res) {
    try {
        const token = req.headers.authorization;
        jwt.verify(token, key);
        const [productList] = await sql.query("SELECT * FROM products");
        res.status(200).json(productList);
    } catch (error) {
        res.status(401).send("Token not found or expired. Please log in to continue!");
    }
});

// Route to retrieve product by ID
server.get("/products/:id", async function(req, res) {
    try {
        const token = req.headers.authorization;
        jwt.verify(token, key);
        const [product] = await sql.query(`SELECT * FROM products WHERE product_id = "${req.params.id}"`);
        if (product.length === 0) {
            res.status(404).send("Product not found!");
        } else {
            res.status(200).json(product);
        }
    } catch(error) {
        res.status(401).send("Token not found or expired. Please log in to continue!");
    }
});

// Create items
server.post("/products", adminAuth, async function(req, res) {
    try {
        const { name, price, photo_link } = req.body;
        if (!name || !price || !photo_link) {
            return res.status(400).send("Error in request! The required fields are name, price, and photo_link.");
        }

        await sql.query(`
            INSERT INTO products (name, price, photo_link) 
            VALUES ("${name}", "${price}", "${photo_link}")
        `);

        const [id] = await sql.query("SELECT * FROM products ORDER BY product_id DESC LIMIT 1");
        res.status(201).json(id);
    } catch(error) {
        res.status(500).send("Internal Server Error! Something went wrong while processing your request.");
    }
});

// Update item by ID
server.put("/products/:id", adminAuth, async function(req, res) {
    try {
        const { name, price, photo_link } = req.body;
        const { id } = req.params;

        if (!name && !price && !photo_link) {
            return res.status(400).send("No data provided for update!");
        }

        const updatedFields = {};

        if (name) {
            updatedFields.name = name;
        }
        if (price) {
            updatedFields.price = price;
        }
        if (photo_link) {
            updatedFields.photo_link = photo_link;
        }

        const updateQuery = Object.entries(updatedFields).map(([key, value]) => `${key} = "${value}"`).join(", ");

        await sql.query(`
            UPDATE products 
            SET ${updateQuery}
            WHERE product_id = "${id}"
        `);

        const [updatedItem] = await sql.query(`SELECT * FROM products WHERE product_id = "${id}"`);
        res.status(200).json(updatedItem);
    } catch(error) {
        res.status(500).send("Internal Server Error! Something went wrong while processing your request.");
    }
});

// Delete item by ID
server.delete("/products/:id", adminAuth, async function(req, res) {
    try {
        const { id } = req.params;
        const result = await sql.query(`DELETE FROM products WHERE product_id = "${id}"`);

        if (result.affectedRows === 0) {
            res.status(404).send("Item not found!");
        } else {
            res.status(200).send("Product deleted!");
        }
    } catch(error) {
        res.status(500).send("Internal Server Error! Something went wrong while processing your request.");
    }
});

//----------------------- USERS

// View list of users
server.get("/users", adminAuth, async function(req, res) {
    try {
        const [userList] = await sql.query("SELECT * FROM users");
        res.status(200).json(userList);
    } catch(error) {
        res.status(500).send("Internal Server Error! Something went wrong while processing your request.");
    }
});

// Create a new user
server.post("/users", async function(req, res) {
    try {
        const { username, full_name, email, phone_number, address, password, is_admin } = req.body;

        if (!username || !full_name || !email || !phone_number || !address || !password || is_admin === undefined) {
            return res.status(400).send("Error in request! The required fields are: username, full_name, email, phone_number, address, password, and is_admin.");
        }

        await sql.query(`
            INSERT INTO users (username, full_name, email, phone_number, address, password, is_admin) 
            VALUES ("${username}", "${full_name}", "${email}", "${phone_number}", "${address}", "${password}", "${is_admin}")
        `);

        const [id] = await sql.query("SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1");
        res.status(201).json(id);
    } catch(error) {
        res.status(500).send("Internal Server Error! Something went wrong while processing your request.");
    }
});

// User login
server.post("/users/login", async function(req, res) {
    try {
        const { username, password } = req.body;

        const [user] = await sql.query(`SELECT * FROM users WHERE username = "${username}" AND password = "${password}"`);

        if (user.length === 0) {
            return res.status(401).send("Incorrect credentials!");
        }

        const isAdmin = user[0].admin;
        const token = jwt.sign({ username: username, admin: isAdmin }, key, { expiresIn: "60m" });

        res.status(200).send("User authenticated! Token: " + token);
    } catch(error) {
        res.status(500).send("Internal Server Error! Something went wrong while processing your request.");
    }
});

//----------------------- ORDERS

// View list of orders
server.get("/orders", adminAuth, async function(req, res) {
    try {
        const [orders] = await sql.query(`
            SELECT o.*, u.username, u.address
            FROM orders AS o
            JOIN users AS u ON o.user_id = u.user_id
        `);

        for (let order of orders) {
            order.products = await getProductDetails(order.order_id);
        }

        res.status(200).json(orders);
    } catch(error) {
        res.status(500).send("Internal Server Error! Something went wrong while processing your request.");
    }
});

// Create a new order
server.post("/orders", async function(req, res) {
    try {
        const token = req.headers.authorization;
        const verify = jwt.verify(token, key);
        const user = verify.username;
        const { products, price, paymentMethod } = req.body;

        // Fetch user data
        const [userData] = await sql.query(`SELECT * FROM users WHERE username = "${user}"`);

        if (userData.length === 0) {
            return res.status(400).send("Error authenticating user!");
        }

        // Create order description
        const description = [];
        for (const product of products) {
            const productDescription = await orderInfo(product.product_id, product.quantity);
            description.push(productDescription);
        }

        // Insert order into database
        const [orderId] = await sql.query(`
            INSERT INTO orders(user_id, time, description, total_price, payment_method)
            VALUES ("${userData[0].user_id}", "${new Date().toLocaleTimeString()}", "${description.join(", ")}", "${price}", "${paymentMethod}")
        `);

        // Insert order items into database
        for (const product of products) {
            await sql.query(`
                INSERT INTO orders_products(order_id, product_id, product_quantity, payment_method)
                VALUES ("${orderId}", "${product.product_id}", "${product.quantity}", "${paymentMethod}")
            `);
        }

        // Fetch order details
        const [response] = await sql.query(`
            SELECT o.order_id, o.description, o.total_price, o.payment_method, u.username, u.address
            FROM orders AS o
            JOIN users AS u ON o.user_id = u.user_id
            WHERE o.order_id = "${orderId}"
        `);

        // Fetch order products
        const [productsData] = await sql.query(`
            SELECT op.product_id, op.product_quantity, p.name, p.price
            FROM orders_products AS op
            JOIN products AS p ON op.product_id = p.product_id
            WHERE op.order_id = "${orderId}"
        `);

        response[0].products = productsData;
        res.status(201).json(response[0]);
    } catch(error) {
        res.status(401).send("Token not found or expired. Please log in to continue!");
    }
});

// Update the status of an order
server.put("/orders/:id", adminAuth, async function(req, res) {
    const { status } = req.body;
    try {
        await sql.query(`
            UPDATE orders 
            SET status = "${status}" 
            WHERE order_id = "${req.params.id}"
        `);

        const [updatedOrder] = await sql.query(`
            SELECT * 
            FROM orders 
            WHERE order_id = "${req.params.id}"
        `);

        res.status(200).json(updatedOrder);
    } catch(error) {
        res.status(500).send("Internal Server Error! Something went wrong while processing your request.");
    }
});

// Delete an order
server.delete("/orders/:id", adminAuth, async function(req, res) {
    try {
        const result = await sql.query(`DELETE FROM orders WHERE order_id = "${req.params.id}"`);
        if (result.affectedRows === 0) {
            res.status(404).send("Order not found!");
        } else {
            res.status(200).send("Order deleted!");
        }
    } catch(error) {
        res.status(500).send("Internal Server Error! Something went wrong while processing your request.");
    }
});
