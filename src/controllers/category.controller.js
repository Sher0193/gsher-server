const Category = require("../models/category.model.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const body = req.body;
  const cat = new Category({
    category: body.category,
  });
  Category.create(cat, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Post.",
      });
    else res.send({ success: true, data: data });
  });
};

exports.findMany = (req, res) => {
  if (req.query.posts) {
    console.log(req.query.posts);
    Category.getByPosts(req.query.posts, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving categories.",
        });
      else res.send({ success: true, data: data });
    });
  } else {
    Category.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving posts.",
        });
      else res.send({ success: true, data: data });
    });
  }
};

exports.findOne = (req, res) => {
  Category.findById(req.params.catId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Category with id ${req.params.catId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Post with id " + req.params.catId,
        });
      }
    } else res.send({ success: true, data: data });
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log(req.body);
  const body = req.body;
  Category.updateById(
    req.params.catId,
    new Category({
      category: body.category,
    }),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Category with id ${req.params.catId}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating Category with id " + req.params.catId,
          });
        }
      } else res.send({ success: true, data: data });
    }
  );
};

exports.delete = (req, res) => {
  Category.remove(req.params.catId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Category with id ${req.params.catId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Category with id " + req.params.catId,
        });
      }
    } else
      res.send({
        success: true,
        message: `Category was deleted successfully!`,
      });
  });
};

exports.deleteAll = (req, res) => {
  Category.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all categories.",
      });
    else
      res.send({
        success: true,
        message: `All categories were deleted successfully!`,
      });
  });
};
