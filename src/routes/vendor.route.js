module.exports = (app) => {
  const vendor = require("../controllers/vendor.controller.js");
  const auth = require("../controllers/login.controller.js");

  const vendUrl = "/api/vendors/";

  // CREATE ONE
  app.post(vendUrl, auth.authenticate, vendor.create);

  // READ ALL
  app.get(vendUrl, vendor.findMany);

  // READ ONE BY ID
  app.get(vendUrl + ":vendId", vendor.findOne);

  // UPDATE ONE BY ID
  app.put(vendUrl + ":vendId", auth.authenticate, vendor.update);

  // DELETE ONE BY ID
  app.delete(vendUrl + ":vendId", auth.authenticate, vendor.delete);

  // DELETE ALL
  app.delete(vendUrl, auth.authenticate, vendor.deleteAll);
};
