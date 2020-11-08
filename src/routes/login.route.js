module.exports = (app) => {
  const Login = require("../controllers/login.controller.js");

  // LOG IN
  app.post("/api/login", Login.logIn);

  //LOG OUT
  app.post("/api/logout", Login.logOut);

  //CHECK IF LOGGED IN
  app.post("/api/isLoggedIn", Login.isLoggedIn);
};
