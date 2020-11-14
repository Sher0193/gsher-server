module.exports = (app) => {
  const express = require("express");
  const site = require("../controllers/site.controller.js");
  const auth = require("../controllers/login.controller.js");

  const siteUrl = "/api/site/data/";

  app.get(siteUrl + "about", site.getAbout);

  app.get(siteUrl + "statement", site.getStatement);

  app.post(siteUrl + "about", auth.authenticate, site.postAbout);

  app.post(siteUrl + "statement", auth.authenticate, site.postStatement);

  app.use("/api/analytics/", [
    auth.authenticate,
    express.static("private/report.html"),
  ]);
};
