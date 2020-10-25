const sql = require("./db.js");

// constructor
const Post_Category = function (post_category) {
  this.postsId = post_category.postId;
  this.categoriesId = post_category.categoryId;
};

// create new
Post_Category.create = (newAssocs, result) => {
  sql.query(
    "INSERT INTO posts_categories (posts_id, categories_id) VALUES ?",
    [newAssocs],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("created assoc ", { id: res.insertId, ...newAssocs });
      result(null, { id: res.insertId, ...newAssocs });
    }
  );
};

// find single
Post_Category.findById = (assocId, result) => {
  sql.query(`SELECT * FROM posts WHERE id = ${assocId} LIMIT 1`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found assoc: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

// find all
Post_Category.getAll = (result) => {
  sql.query("SELECT * FROM posts_categories", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("assocs: ", res);
    result(null, res);
  });
};

// update single
Post_Category.updateById = (id, assoc, result) => {
  sql.query(
    "UPDATE posts_categories SET posts_id = ?, categories_id = ? WHERE id = ?",
    [assoc.post_id, assoc.category_id, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated assoc: ", { id: id, ...assoc });
      result(null, { id: id, ...assoc });
    }
  );
};

// remove single
Post_Category.remove = (id, result) => {
  sql.query("DELETE FROM posts_categories WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted assoc with id: ", id);
    result(null, res);
  });
};

// remove all
Post_Category.removeAll = (result) => {
  sql.query("DELETE FROM posts_categories", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} assocs`);
    result(null, res);
  });
};

// remove all by post id
Post_Category.removeAllByPost = (postId, result) => {
  sql.query(
    "DELETE FROM posts_categories WHERE posts_id = ?",
    postId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted assoc with post id: ", postId);
      result(null, res);
    }
  );
};

module.exports = Post_Category;
