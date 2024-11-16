const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "nodejs_user",
    password: "nodejs_password",
    database: "mydb"
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the database.");
});

app.get("/laptops", (req, res) => {
    const sql = "SELECT * FROM laptopprices ORDER BY Price_euros ASC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).send("Error fetching data.");
            return;
        }
        res.json(results);
    });
});

app.post("/laptops", (req, res) => {
    const {
        Company,
        Product,
        TypeName,
        Inches,
        Ram,
        OS,
        Weight,
        Price_euros,
        Screen,
        ScreenW,
        ScreenH,
        TOUCHSCREEN,
        IPSpanel,
        RetinaDisplay,
        CPU_company,
        CPU_freq,
        CPU_model,
        PrimaryStorage,
        SecondaryStorage,
        PrimaryStorageType,
        SecondaryStorageType,
        GPU_company,
        GPU_model
    } = req.body;

    const sql = `
        INSERT INTO laptopprices (
            Company, Product, TypeName, Inches, Ram, OS, Weight, Price_euros, Screen, 
            ScreenW, ScreenH, TOUCHSCREEN, IPSpanel, RetinaDisplay, CPU_company, CPU_freq, 
            CPU_model, PrimaryStorage, SecondaryStorage, PrimaryStorageType, SecondaryStorageType, 
            GPU_company, GPU_model
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        Company, Product, TypeName, Inches, Ram, OS, Weight, Price_euros, Screen, 
        ScreenW, ScreenH, TOUCHSCREEN, IPSpanel, RetinaDisplay, CPU_company, CPU_freq, 
        CPU_model, PrimaryStorage, SecondaryStorage, PrimaryStorageType, SecondaryStorageType, 
        GPU_company, GPU_model
    ], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            res.status(500).send("Error inserting data.");
            return;
        }
        res.status(201).send(`Laptop added!`);
    });
});

app.put("/laptops/:product", (req, res) => {
    const { product } = req.params;
    const { Price_euros } = req.body;

    const sql = "UPDATE laptopprices SET Price_euros = ? WHERE Product = ?";
    db.query(sql, [Price_euros, product], (err, result) => {
        if (err) {
            console.error("Error updating data:", err);
            res.status(500).send("Error updating data.");
            return;
        }
        res.send(`Laptop with Product: ${product} updated successfully.`);
    });
});

app.delete("/laptops/:product", (req, res) => {
    const { product } = req.params;

    const sql = "DELETE FROM laptopprices WHERE Product = ?";
    db.query(sql, [product], (err, result) => {
        if (err) {
            console.error("Error deleting data:", err);
            res.status(500).send("Error deleting data.");
            return;
        }
        res.send(`Laptop with Product: ${product} deleted successfully.`);
    });
});

app.get("/laptops/grouped", (req, res) => {
    const sql = `
        SELECT Company, COUNT(*) AS product_count 
        FROM laptopprices 
        GROUP BY Company 
        ORDER BY product_count DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching grouped data:", err);
            res.status(500).send("Error fetching grouped data.");
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
