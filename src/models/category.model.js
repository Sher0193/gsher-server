const sql = require("./db.js");

// constructor
const Category = function (category) {
  this.category = category.category;
};

Category.create = (newCategory, result) => {
  sql.query("INSERT INTO categories SET ?", newCategory, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created category ", { id: res.insertId, ...newCategory });
    result(null, { id: res.insertId, ...newCategory });
  });
};

Category.findById = (catId, result) => {
  sql.query(
    `SELECT * FROM categories WHERE id = ${catId} LIMIT 1`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found category: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Customer with the id
      result({ kind: "not_found" }, null);
    }
  );
};

Category.getByPosts = (posts, result) => {
  sql.query(
    `SELECT categories.* FROM categories LEFT JOIN posts_categories ON (categories.id = posts_categories.categories_id) LEFT JOIN posts ON (posts_categories.posts_id = posts.id) WHERE posts.id IN (?) GROUP BY categories.id`,
    [posts],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("posts: ", res);
      result(null, res);
    }
  );
};

Category.getAll = (result) => {
  sql.query("SELECT * FROM categories", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("categories: ", res);
    result(null, res);
  });
};

Category.updateById = (catId, category, result) => {
  sql.query(
    "UPDATE categories SET category = ? WHERE id = ?",
    [category.category, catId],
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

      console.log("updated category: ", { id: catId, ...category });
      result(null, { id: catId, ...category });
    }
  );
};

Category.remove = (catId, result) => {
  sql.query("DELETE FROM categories WHERE id = ?", catId, (err, res) => {
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

    console.log("deleted category with id: ", catId);
    result(null, res);
  });
};

Category.removeAll = (result) => {
  sql.query("DELETE FROM categories", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} categories`);
    result(null, res);
  });
};

module.exports = Category;
