const express = require('express');
const mysql = require('mysql');
const config = require("./config.json");
const app = express();

const db = mysql.createPool({
    host: config.dbhost,
    user: config.dbuser,
    password: config.dbpass,
    database: config.dbname
});

// CREATE ONE
app.post("/api/posts/", (req, res) => {
    
});

// READ ALL
app.get("/api/posts/", (req, res) => {

});

// READ ONE
app.get("/api/posts/:post", (req, res) => {
});

// UPDATE ONE
app.put("/api/posts/:post", (req, res) => {
    
});

// DELETE ONE
app.delete("/api/posts/:post", (req, res) => {
    
});

app.listen(3001, () => {
        console.log("running on port 3001");
    }
);
