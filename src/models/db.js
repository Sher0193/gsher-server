const mysql = require("mysql");
const config = require("../../private/config.json");

const connection = mysql.createConnection({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpass,
  database: config.dbname,
});

module.exports = connection;
