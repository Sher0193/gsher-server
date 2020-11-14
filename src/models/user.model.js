const sql = require("./db.js");
const Logging = require("../logging.js");

// constructor
const User = function (user) {
  this.name = user.name;
  this.password = user.password;
};

// find a single user by user_id
User.findById = (userId, result) => {
  sql.query(`SELECT * FROM users WHERE id = ${userId} LIMIT 1`, (err, res) => {
    if (err) {
      Logging.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //Logging.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

// find a single user by name
User.findByName = (userName, result) => {
  sql.query(
    `SELECT * FROM users WHERE name = "${userName}" LIMIT 1`,
    (err, res) => {
      if (err) {
        Logging.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        //Logging.log("found user: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Customer with the id
      result({ kind: "not_found" }, null);
    }
  );
};

module.exports = User;
