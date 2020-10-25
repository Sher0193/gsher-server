module.exports = (app) => {
  const image = require("../controllers/image.controller.js");
  const auth = require("../controllers/login.controller.js");
  
  app.get("/featuredimages", image.featured);

  app.post(
    "/uploadimage",
    auth.authenticate,
    image.upload.single("image"),
    image.uploadThumbnail
  );

  app.delete("/deleteimage", auth.authenticate, image.deleteImage);
};
