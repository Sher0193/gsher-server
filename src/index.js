const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const https = require("https");
const fs = require("fs");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const LoginRouter = require("./Router/LoginRouter");
const DatabaseRouter = require("./Router/DatabaseRouter");
const ImageRouter = require("./Router/ImageRouter");

const config = require("../private/config.json");

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../build")));
app.use(express.json());

/***************** DATABASE *************************/
const db = mysql.createConnection({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpass,
  database: config.dbname,
});

db.connect(function (err) {
  if (err) {
    console.log("Database connection error.");
    throw err;
    return false;
  }
});

/***************** SESSION *************************/

const sessionStore = new MySQLStore(
  {
    expiration: 1825 * 86400 * 1000,
    endConnectionOnClose: false,
  },
  db
);

app.use(
  session({
    key: config.key,
    secret: config.secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1825 * 86400 * 1000,
      httpOnly: false,
    },
  })
);

/*** CROSSS ORIGIN SHIT - CHANGE TO DISALLOW CROSS ORIGIN BY PRODUCTION ***/
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://192.168.86.185:3000");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

/***************** ROUTERS *************************/

new LoginRouter(app, db);
new DatabaseRouter(app, db);
new ImageRouter(app, db);

/***************** WEBSITE *************************/

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

app.listen(3001, "0.0.0.0", () => {
  console.log("running on port 3000");
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
