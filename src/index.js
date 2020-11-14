const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const https = require("https");
const fs = require("fs");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const db = require("./models/db.js");
const Logging = require("./logging.js");

const config = require("../private/config.json");

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../build")));
app.use(express.json());

// initial db connection
db.connect(function (err) {
  if (err) {
    Logging.log("Database connection error.");
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
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT, DELETE");
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

require("./routes/routes.js")(app);

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
    Logging.log('HTTPS listening on PORT 443');
});*/

app.listen(config.port, "0.0.0.0", () => {
  Logging.log("running on port " + config.port);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
