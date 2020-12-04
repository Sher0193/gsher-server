const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const Logging = require("../logging.js");

exports.logIn = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  username = username.toLowerCase();

  if (username.length > 12 || password.length > 12) {
    res.json({
      success: false,
      msg: "A length error has occurred, please try again.",
    });
    return;
  }

  User.findByName(username, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        Logging.log("*** Invalid log in attempt with invalid username " + username + ".");
        res.status(404).send({
          message: `Not found User with username ${username}.`,
        });
      } else {
        Logging.log("Miscellaneous log in error with username " + username + ".");
        res.status(500).send({
          message: "Error retrieving User with name " + username,
        });
      }
    } else {
      bcrypt.compare(password, data.password, (brcryptErr, verified) => {
        if (verified) {
          req.session.userID = data.id;
          res.json({
            success: true,
            username: data.name,
          });

          return;
        } else {
          Logging.log("*** Invalid log in attempt with invalid password by " + username + ".");
          res.json({
            success: false,
            msg: "Invalid password.",
          });
        }
      });
    }
  });
};

exports.logOut = (req, res) => {
  if (req.session.userID) {
    req.session.destroy();
    res.json({
      success: true,
    });
    return true;
  } else {
    res.json({
      success: false,
    });
    return false;
  }
};

exports.isLoggedIn = (req, res) => {
  if (req.session.userID) {
    User.findById(req.session.userID, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No user found with id ${req.session.userID}.`,
          });
        } else {
          res.status(500).send({
            message: "Error retrieving User with id " + req.session.userID,
          });
        }
      } else {
        res.json({
          success: true,
          username: data.name,
        });
      }
    });
  } else {
    res.json({
      success: false,
    });
    return false;
  }
};

//TODO: merge with isLoggedIn for code reuse
exports.authenticate = (req, res, next) => {
  if (req.session.userID) {
    User.findById(req.session.userID, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(403).send({
            message: `No user found with id ${req.session.userID}.`,
          });
          return false;
        } else {
          res.status(500).send({
            message: "Error retrieving User with id " + req.session.userID,
          });
          return false;
        }
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({
      message: "Request not authenticated.",
    });
    return false;
  }
};
