module.exports = (app) => {
  const emailUrl = "/api/email/";
  const email = require("../controllers/email.controller.js");

  app.post(emailUrl, email.sendMail);
};
