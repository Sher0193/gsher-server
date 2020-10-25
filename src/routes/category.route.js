module.exports = (app) => {
  const categories = require("../controllers/category.controller.js");
  const auth = require("../controllers/login.controller.js");

  const catUrl = "/api/categories/";

  // CREATE ONE
  app.post(catUrl, auth.authenticate, categories.create);

  // READ ALL
  app.get(catUrl, categories.findMany);

  // READ ONE BY ID
  app.get(catUrl + ":catId", categories.findOne);

  // UPDATE ONE BY ID
  app.put(catUrl + ":catId", auth.authenticate, categories.update);

  // DELETE ONE BY ID
  app.delete(catUrl + ":catId", auth.authenticate, categories.delete);

  // DELETE ALL
  app.delete(catUrl, auth.authenticate, categories.deleteAll);
};
