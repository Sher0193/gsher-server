const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const https = require('https');
const fs = require('fs');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Router = require('./Router');

const config = require("./private/config.json");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

/***************** DATABASE *************************/
const db = mysql.createConnection({
    host: config.dbhost,
    user: config.dbuser,
    password: config.dbpass,
    database: config.dbname
});

db.connect(function(err) {
    if (err) {
        console.log("Database connection error.");
        throw err;
        return false;
    }
});

const sessionStore = new MySQLStore({
    expiration: (1825 * 86400 * 1000),
    endConnectionOnClose: false
}, db);

app.use(session({
    key: '5)qUtUKp',
    secret: '@M2g%Mw9',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (1825 * 86400 * 1000),
        httpOnly: false
    }
}));

new Router(app, db);

/*https.createServer(
    {
        key: fs.readFileSync('sslcerts/key.pem', 'utf8'),
        cert: fs.readFileSync('sslcerts/cert.pem', 'utf8'),
        passphrase: 'passphrase'
    },
    app
)
.listen(443, function() {
    console.log('HTTPS listening on PORT 443');
});*/

app.listen(80, () => {
        console.log("running on port 3000");
    }
);

/***************** FEATURED IMAGES *************************/
const featuredUrl = "/api/featured/";

// READ ALL
app.get(featuredUrl, (req, res) => {
});

// GET IMAGE
app.get(featuredUrl+":filename", (req, res) => {
});

/***************** POSTS *************************/
const postUrl = "/api/posts/";

// CREATE ONE
app.post(postUrl, (req, res) => {
    
});

// READ ALL
app.get(postUrl, (req, res) => {

});

// READ ONE
app.get(postUrl+":post", (req, res) => {
    let cols = req.params.post;
    db.query('SELECT * FROM posts WHERE id = ? LIMIT 1', cols, (err, data, fields) => {
                        if (data && data.length === 1) {
                            res.json({
                                success: true,
                                name: data[0].name,
                                meta: data[0].meta,
                                price: data[0].price,
                                sold: data[0].sold,
                                body: body[0].body,
                                link: body[0].link
                            });
                            return true;
                        } else {
                            res.json({
                                success: false
                            });
                            return false;
                        }
                });
});

// GET IMAGE
app.get(postUrl+":post/image", (req, res) => {
});

// GET THUMBNAIL
app.get(postUrl+":post/thumb", (req, res) => {
});

// UPDATE ONE
app.put(postUrl+":post", (req, res) => {
    
});

// DELETE ONE
app.delete(postUrl+":post", (req, res) => {
    
});

/***************** WEBSITE *************************/

app.get('*', function(req, res) {
   res.sendFile(path.join(__dirname, 'build', 'index.html'));; 
});
