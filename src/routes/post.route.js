module.exports = (app) => {
  const posts = require("../controllers/post.controller.js");
  const auth = require("../controllers/login.controller.js");

  const postUrl = "/api/posts/";

  // CREATE ONE
  app.post(postUrl, auth.authenticate, posts.create);

  // READ ALL
  app.get(postUrl, posts.findMany);

  // READ ALL BY CATEGORY
  app.get(postUrl + "category/:categoryId", posts.findMany);

  // READ ONE BY ID
  app.get(postUrl + ":postId", posts.findOne);

  // UPDATE ONE BY ID
  app.put(postUrl + ":postId", auth.authenticate, posts.update);

  // DELETE ONE BY ID
  app.delete(postUrl + ":postId", auth.authenticate, posts.delete);

  // DELETE ALL
  app.delete(postUrl, auth.authenticate, posts.deleteAll);
};
