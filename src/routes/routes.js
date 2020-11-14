module.exports = (app) => {
  require("./login.route.js")(app);
  require("./image.route.js")(app);
  require("./post.route.js")(app);
  require("./category.route.js")(app);
  require("./vendor.route.js")(app);
  require("./site.route.js")(app);
  require("./email.route.js")(app);
};
