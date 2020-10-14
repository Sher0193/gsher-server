const bcrypt = require("bcrypt");

class LoginRouter {
  constructor(app, db) {
    this.login(app, db);
    this.logout(app, db);
    this.isLoggedIn(app, db);
  }

  login(app, db) {
    app.post("/login", (req, res) => {
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

      console.log(username);

      let cols = [username];

      db.query(
        "SELECT * FROM users WHERE name = ? LIMIT 1",
        cols,
        (err, data, fields) => {
          if (err) {
            res.json({
              success: false,
              msg: "A db error has occurred, please try again.",
            });
            return;
          }
          if (data && data.length === 1) {
            // user found
            bcrypt.compare(
              password,
              data[0].password,
              (brcryptErr, verified) => {
                if (verified) {
                  req.session.userID = data[0].id;
                  res.json({
                    success: true,
                    username: data[0].name,
                  });

                  return;
                } else {
                  res.json({
                    success: false,
                    msg: "Invalid password.",
                  });
                }
              }
            );
          } else {
            res.json({
              success: false,
              msg: "No user found with this username.",
            });
            return;
          }
        }
      );
    });
  }

  logout(app, db) {
    app.post("/logout", (req, res) => {
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
    });
  }

  isLoggedIn(app, db) {
    app.post("/isLoggedIn", (req, res) => {
      if (req.session.userID) {
        let cols = [req.session.userID];
        db.query(
          "SELECT * FROM users WHERE id = ? LIMIT 1",
          cols,
          (err, data, fields) => {
            if (data && data.length === 1) {
              res.json({
                success: true,
                username: data[0].name,
              });
              return true;
            } else {
              res.json({
                success: false,
              });
              return false;
            }
          }
        );
      } else {
        res.json({
          success: false,
        });
        return false;
      }
    });
  }
}

module.exports = LoginRouter;
