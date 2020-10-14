class DatabaseRouter {
  constructor(app, db) {
    this.doPosts(app, db);
  }

  doPosts(app, db) {
    const postUrl = "/api/posts/";

    // CREATE ONE
    app.post(postUrl, (req, res) => {});

    // READ ALL
    app.get(postUrl, (req, res) => {
      db.query("SELECT * FROM posts", (err, data, fields) => {
        if (data && data.length > 0) {
          let resData = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i] !== undefined) {
              resData.push({
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
              name: data[0].name,
              meta: data[0].meta,
              price: data[0].price,
              sold: data[0].sold,
              body: data[0].body,
              link: data[0].link,
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
    });

    // UPDATE ONE
    app.put(postUrl + ":post", (req, res) => {});

    // DELETE ONE
    app.delete(postUrl + ":post", (req, res) => {});
  }
}

module.exports = DatabaseRouter;
