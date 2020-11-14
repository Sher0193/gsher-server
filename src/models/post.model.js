const sql = require("./db.js");
const Logging = require("../logging.js");

// constructor
const Post = function (post) {
  this.name = post.name;
  this.dimensions = post.dimensions;
  this.meta = post.meta;
  this.link = post.link;
  this.price = post.price;
  this.sold = post.sold;
  this.date_painted = post.date_painted;
  (this.featured = post.featured), (this.vendor_id = post.vendor);
};

// create a new post
Post.create = (newPost, result) => {
  sql.query("INSERT INTO posts SET ?", newPost, (err, res) => {
    if (err) {
      Logging.log("error: ", err);
      result(err, null);
      return;
    }
    Logging.log("created post ", { id: res.insertId, ...newPost });
    result(null, { id: res.insertId, ...newPost });
    return res.insertId;
  });
};

// find a single post by post_id
Post.findById = (postId, result) => {
  sql.query(`SELECT * FROM posts WHERE id = ${postId} LIMIT 1`, (err, res) => {
    if (err) {
      Logging.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //Logging.log("found post: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

// find all posts with matching categories
Post.getByCategories = (order, categories, result) => {
  sql.query(
    `SELECT posts.* FROM posts LEFT JOIN posts_categories ON (posts.id = posts_categories.posts_id) LEFT JOIN categories ON (posts_categories.categories_id = categories.id) WHERE categories.id IN (?) GROUP BY posts.id ORDER BY ${order} DESC`,
    [categories],
    (err, res) => {
      if (err) {
        Logging.log("error: ", err);
        result(null, err);
        return;
      }

      //Logging.log("posts: ", res);
      result(null, res);
    }
  );
};

Post.getFeatured = (result) => {
  sql.query(
    `SELECT * FROM posts WHERE featured = 1 ORDER BY date_painted DESC`,
    (err, res) => {
      if (err) {
        Logging.log("error: ", err);
        result(null, err);
        return;
      }

      //Logging.log("posts: ", res);
      result(null, res);
    }
  );
};

// return all posts
Post.getAll = (order, result) => {
  sql.query(`SELECT * FROM posts ORDER BY ${order} DESC`, (err, res) => {
    if (err) {
      Logging.log("error: ", err);
      result(null, err);
      return;
    }

    //Logging.log("posts: ", res);
    result(null, res);
  });
};

// update a post at id by fields in post
Post.updateById = (id, post, result) => {
  sql.query(
    "UPDATE posts SET name = ?, dimensions = ?, meta = ?, link = ?, price = ?, sold = ?, date_painted = ?, featured = ?, vendor_id = ? WHERE id = ?",
    [
      post.name,
      post.dimensions,
      post.meta,
      post.link,
      post.price,
      post.sold,
      post.date_painted,
      post.featured,
      post.vendor_id,
      id,
    ],
    (err, res) => {
      if (err) {
        Logging.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      Logging.log("updated post: ", { id: id, ...post });
      result(null, { id: id, ...post });
    }
  );
};

// remove a post at id
Post.remove = (id, result) => {
  sql.query("DELETE FROM posts WHERE id = ?", id, (err, res) => {
    if (err) {
      Logging.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    Logging.log("deleted post with id: ", id);
    result(null, res);
  });
};

// remove all posts
Post.removeAll = (result) => {
  sql.query("DELETE FROM posts", (err, res) => {
    if (err) {
      Logging.log("error: ", err);
      result(null, err);
      return;
    }

    Logging.log(`deleted ${res.affectedRows} posts`);
    result(null, res);
  });
};

module.exports = Post;
