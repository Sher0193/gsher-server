const Vendor = require("../models/vendor.model.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const body = req.body;
  const vendor = new Vendor({
    name: body.name,
    link: body.link === "" ? null : body.link,
    phone: body.phone === "" ? null : body.phone,
  });
  Vendor.create(vendor, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Post.",
      });
    else res.send({ success: true, data: data });
  });
};

exports.findMany = (req, res) => {
  Vendor.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving vendors.",
      });
    else res.send({ success: true, data: data });
  });
};

exports.findOne = (req, res) => {
  Vendor.findById(req.params.vendId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Vendor with id ${req.params.vendId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Post with id " + req.params.vendId,
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
  Vendor.updateById(
    req.params.vendId,
    new Vendor({
      name: body.name,
      link: body.link === "" ? null : body.link,
      phone: body.phone === "" ? null : body.phone,
    }),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Vendor with id ${req.params.vendId}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating Vendor with id " + req.params.vendId,
          });
        }
      } else res.send({ success: true, data: data });
    }
  );
};

exports.delete = (req, res) => {
  Vendor.remove(req.params.vendId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Vendor with id ${req.params.vendId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Vendor with id " + req.params.vendId,
        });
      }
    } else
      res.send({
        success: true,
        message: `Vendor was deleted successfully!`,
      });
  });
};

exports.deleteAll = (req, res) => {
  Vendor.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all vendors.",
      });
    else
      res.send({
        success: true,
        message: `All vendors were deleted successfully!`,
      });
  });
};
