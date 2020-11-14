const Post = require("../models/post.model.js");
const PostCategories = require("../models/post_category.model.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const body = req.body;
  //console.log(body);
  const post = new Post({
    name: body.name,
    dimensions: body.dimensions,
    meta: body.meta,
    link: body.filename,
    price: parseInt(body.price),
    sold: body.sold === "true" ? 1 : 0,
    date_painted: body.date,
    featured: body.featured === "true" ? 1 : 0,
    vendor: body.vendor && body.vendor >= 0 ? body.vendor : null,
  });
  let postResult = null;
  Post.create(post, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Post.",
      });
    else {
      if (data.id && body.categories.length > 0) {
        let assocArray = [];
        for (let i = 0; i < body.categories.length; i++) {
          assocArray.push([data.id, body.categories[i]]);
        }
        PostCategories.create(assocArray, (err, catData) => {
          if (err)
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Post.",
            });
          else {
            res.send({ success: true, postData: data, catData: catData });
            return;
          }
        });
      } else {
        res.send({ success: true, postData: data });
      }
    }
  });
};

exports.findMany = (req, res) => {
  const PER_PAGE = 9;
  if (req.query.featured) {
    Post.getFeatured((err, data) => {
      if (err)
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving posts.",
        });
      else res.send({ success: true, data: data });
    });
  } else if (req.query.tags) {
    //console.log(req.query.tags);
    Post.getByCategories("date_painted", req.query.tags, (err, data) => {
      if (err)
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving posts.",
        });
      else {
        finalData = data;
        if (req.query.paginate) {
          let paginatedData = [];
          let page = [];
          for (let i = 0; i < data.length; i++) {
            if (page.length >= PER_PAGE) {
              paginatedData.push(page);
              page = [];
            }
            page.push(data[i]);
          }
          paginatedData.push(page);
          finalData = paginatedData;
        }
        res.send({ success: true, data: finalData });
      }
    });
  } else {
    Post.getAll("date_painted", (err, data) => {
      if (err)
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving posts.",
        });
      else {
        finalData = data;
        if (req.query.paginate) {
          let paginatedData = [];
          let page = [];
          for (let i = 0; i < data.length; i++) {
            if (page.length >= PER_PAGE) {
              paginatedData.push(page);
              page = [];
            }
            page.push(data[i]);
          }
          paginatedData.push(page);
          finalData = paginatedData;
        }
        res.send({ success: true, data: finalData });
      }
    });
  }
};

exports.findOne = (req, res) => {
  Post.findById(req.params.postId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Post with id ${req.params.postId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Post with id " + req.params.postId,
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
  //console.log(req.body);
  const body = req.body;
  Post.updateById(
    req.params.postId,
    new Post({
      name: body.name,
      dimensions: body.dimensions,
      meta: body.meta,
      link: body.filename,
      price: parseInt(body.price),
      sold: body.sold,
      date_painted: body.date,
      featured: body.featured === null ? 0 : body.featured,
      vendor: body.vendor && body.vendor >= 0 ? body.vendor : null,
    }),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Post with id ${req.params.postId}.`,
          });
          return;
        } else {
          res.status(500).send({
            message: "Error updating Post with id " + req.params.postId,
          });
          return;
        }
      } else {
        if (data.id && body.categories) {
          PostCategories.removeAllByPost(data.id, (err, delResult) => {
            if (err) {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while clearing old categories.",
              });
              return;
            }
          });
          let assocArray = [];
          for (let i = 0; i < body.categories.length; i++) {
            assocArray.push([data.id, body.categories[i]]);
          }
          if (assocArray.length > 0) {
            PostCategories.create(assocArray, (err, catData) => {
              if (err) {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while creating new categories.",
                });
                return;
              } else {
                res.send({ success: true, postData: data, catData: catData });
                return;
              }
            });
          } else {
            res.send({ success: true, postData: data });
          }
        } else {
          res.send({ success: true, postData: data });
        }
      }
    }
  );
};

exports.delete = (req, res) => {
  Post.remove(req.params.postId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Post with id ${req.params.postId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Post with id " + req.params.postId,
        });
      }
    } else
      res.send({ success: true, message: `Post was deleted successfully!` });
  });
};

exports.deleteAll = (req, res) => {
  Post.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all posts.",
      });
    else
      res.send({
        success: true,
        message: `All posts were deleted successfully!`,
      });
  });
};
