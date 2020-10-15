const multer = require("multer");
const formidable = require("formidable");
const sharp = require("sharp");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4000 * 4000 * 5,
  },
  fileFilter: fileFilter,
});

class ImageRouter {
  constructor(app, db) {
    this.uploadImage(app, db);
    this.deleteImage(app, db);
  }

  uploadImage(app, db) {
    app.post("/uploadimage", upload.single("image"), (req, res) => {
      if (!req.file) {
        res.json({
          success: false,
          msg: "Image uploading issue.",
        });
        return;
      }
      sharp(req.file.path)
        .resize(null, 250)
        .toFile(
          "public/img/thumbnails/" + req.file.filename,
          (err, resizeImage) => {
            if (err) {
              res.json({
                success: false,
                msg: "Thumbnail generation issue.",
              });
              return;
            }
            res.json({
              success: true,
              msg: "Uploaded image with no db query.",
              filename: req.file.filename,
            });
          }
        );
    });
  }

  deleteImage(app, db) {
    app.delete("/deleteimage", (req, res) => {
      if (req.body.filename) {
        try {
          fs.unlinkSync("public/img/thumbnails/" + req.body.filename);
          fs.unlinkSync("public/img/" + req.body.filename);
          res.json({
            success: true,
            msg: "Removed thumbnail and image file " + req.body.filename,
          });
        } catch (e) {
          res.json({
            success: false,
            msg: "Issue removing files.",
          });
          return;
        }
      }
    });
  }
}

module.exports = ImageRouter;
