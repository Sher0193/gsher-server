class DatabaseRouter {
  constructor(app, db) {
    this.doPosts(app, db);
    this.doCategories(app, db);
  }

  doPosts(app, db) {
    const postUrl = "/api/posts/";

    // CREATE ONE
    app.post(postUrl, (req, res) => {
      let body = req.body;
      let cols = [
        body.name,
        body.dimensions,
        body.meta,
        body.filename,
        body.category,
        parseInt(body.price),
        body.sold === "true" ? 1 : 0,
        body.date,
      ];
      console.log(cols);
      db.query(
        "INSERT INTO posts (name, dimensions, meta, link, category_id, price, sold, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        cols,
        (err, result) => {
          if (err) {
            res.json({
              success: false,
              msg: "Database insert error.",
            });
            return;
          } else if (result.affectedRows < 1) {
            res.json({
              success: false,
              msg: "Database insert issue.",
            });
            return;
          }
          res.json({
            success: true,
            id: result.insertId,
            msg: "Created database entry.",
          });
          return;
        }
      );
    });

    // READ ALL
    app.get(postUrl, (req, res) => {
      db.query("SELECT * FROM posts", (err, data, fields) => {
        if (data && data.length > 0) {
          let resData = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i] !== undefined) {
              resData.push({
                id: data[i].id,
                name: data[i].name,
                dimensions: data[i].dimensions,
                meta: data[i].meta,
                price: data[i].price,
                sold: data[i].sold,
                body: data[i].body,
                link: data[i].link,
              });
            }
          }
          res.json({
            success: true,
            results: resData,
          });
          return true;
        } else {
          res.json({
            success: false,
            msg: "No results found.",
          });
        }
      });
    });

    // READ PAGE
    app.get(postUrl + ":page", (req, res) => {
      const PER_PAGE = 25;
      let page = (parseInt(req.params.page) - 1) * 25;
      if (page < 0) {
        res.json({
          success: false,
          msg: "Cannot query a page number less than 1.",
        });
        return;
      }
      db.query("SELECT * FROM posts", (err, data, fields) => {
        if (data && data.length > 0) {
          let resData = [];
          for (let i = page; i < PER_PAGE * (page + 1); i++) {
            if (data[i] !== undefined) {
              resData.push({
                id: data[i].id,
                name: data[i].name,
                dimensions: data[i].dimensions,
                meta: data[i].meta,
                price: data[i].price,
                sold: data[i].sold,
                body: data[i].body,
                link: data[i].link,
              });
            }
          }
          let pages = Math.ceil(data.length / PER_PAGE);
          res.json({
            success: true,
            pageCount: pages,
            results: resData,
          });
          return true;
        } else {
          res.json({
            success: false,
            msg: "No results found.",
          });
        }
      });
    });

    // READ ONE
    app.get(postUrl + "post/:post", (req, res) => {
      let cols = req.params.post;
      db.query(
        "SELECT * FROM posts WHERE id = ? LIMIT 1",
        cols,
        (err, data, fields) => {
          if (data && data.length === 1) {
            res.json({
              success: true,
              id: data[0].id,
              name: data[0].name,
              meta: data[0].meta,
              price: data[0].price,
              sold: data[0].sold,
              body: data[0].body,
              link: data[0].link,
              category: data[0].category_id,
              dimensions: data[0].dimensions,
              date: data[0].date_created,
            });
            return true;
          } else {
            res.json({
              success: false,
              msg: "No result found.",
            });
            return false;
          }
        }
      );
    });

    // UPDATE ONE
    app.put(postUrl + ":post", (req, res) => {
      let cols = [
        req.body.name,
        req.body.dimensions,
        req.body.meta,
        req.body.filename,
        req.body.category,
        parseInt(req.body.price),
        req.body.sold === "true" ? 1 : 0,
        req.body.date,
        req.params.post,
      ];
      db.query(
        "UPDATE posts SET name = ?, dimensions = ?, meta = ?, link = ?, category_id = ?, price = ?, sold = ?, date_created = ? WHERE id = ? LIMIT 1",
        cols,
        (err, result) => {
          if (err) {
            console.log(err);
            res.json({
              success: false,
              msg: "Database insert error.",
            });
            return;
          } else if (result.affectedRows < 1) {
            console.log(result);
            res.json({
              success: false,
              msg: "Database insert issue.",
            });
            return;
          }
          res.json({
            success: true,
            id: result.insertId,
            msg: "Created database entry.",
          });
          return;
        }
      );
    });

    // DELETE ONE
    app.delete(postUrl + ":post", (req, res) => {
      let cols = req.params.post;
      db.query("DELETE FROM posts WHERE id = ?", cols, (err, result) => {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            msg: "Database error.",
          });
          return;
        } else if (result.affectedRows < 1) {
          console.log(result);
          res.json({
            success: false,
            msg: "Database deletion issue.",
          });
          return;
        }
        res.json({
          success: true,
          msg: "Deleted database entry.",
        });
        return;
      });
    });
  }

  doCategories(app, db) {
    const catUrl = "/api/categories/";

    // CREATE ONE
    app.post(catUrl, (req, res) => {
      let body = req.body;
      let cols = [body.category];
      console.log(cols);
      db.query(
        "INSERT INTO categories (category) VALUES (?)",
        cols,
        (err, result) => {
          if (err) {
            res.json({
              success: false,
              msg: "Database insert error.",
            });
            return;
          } else if (result.affectedRows < 1) {
            res.json({
              success: false,
              msg: "Database insert issue.",
            });
            return;
          }
          res.json({
            success: true,
            id: result.insertId,
            msg: "Created database entry.",
          });
          return;
        }
      );
    });

    // READ ALL
    app.get(catUrl, (req, res) => {
      db.query("SELECT * FROM categories", (err, data, fields) => {
        if (data && data.length > 0) {
          let resData = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i] !== undefined) {
              resData.push({
                id: data[i].id,
                name: data[i].category,
              });
            }
          }
          res.json({
            success: true,
            results: resData,
          });
          return true;
        }
      });
    });

    // UPDATE ONE
    app.put(catUrl + ":cat", (req, res) => {
      let cols = [req.body.category, req.params.cat];
      db.query(
        "UPDATE categories SET category = ? WHERE id = ? LIMIT 1",
        cols,
        (err, result) => {
          if (err) {
            console.log(err);
            res.json({
              success: false,
              msg: "Database insert error.",
            });
            return;
          } else if (result.affectedRows < 1) {
            console.log(result);
            res.json({
              success: false,
              msg: "Database insert issue.",
            });
            return;
          }
          res.json({
            success: true,
            id: result.insertId,
            msg: "Created database entry.",
          });
          return;
        }
      );
    });

    // DELETE ONE
    app.delete(catUrl + ":cat", (req, res) => {
      let cols = req.params.cat;
      db.query("DELETE FROM categories WHERE id = ?", cols, (err, result) => {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            msg: "Database error.",
          });
          return;
        } else if (result.affectedRows < 1) {
          console.log(result);
          res.json({
            success: false,
            msg: "Database deletion issue.",
          });
          return;
        }
        res.json({
          success: true,
          msg: "Deleted database entry.",
        });
        return;
      });
    });
  }
}

module.exports = DatabaseRouter;
