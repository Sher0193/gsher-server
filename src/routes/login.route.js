module.exports = (app) => {
  const Login = require("../controllers/login.controller.js");

  // LOG IN
  app.post("/login", Login.logIn);

  //LOG OUT
  app.post("/logout", Login.logOut);

  //CHECK IF LOGGED IN
  app.post("/isLoggedIn", Login.isLoggedIn);
};
