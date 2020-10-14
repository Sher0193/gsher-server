const multer = require("multer");
const formidable = require("formidable");
const sharp = require("sharp");

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
            } else {
              let body = req.body;
              let cols = [
                body.name,
                body.dimensions,
                body.meta,
                req.file.filename,
                body.category,
                parseInt(body.price),
                body.sold === "true" ? 1 : 0,
                body.date,
              ];
              console.log(cols);
              db.query(
                "INSERT INTO posts (name, dimensions, meta, link, category, price, sold, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                cols,
                (err, result) => {
                  if (err) {
                    res.json({
                      success: false,
                      msg: "Database insert error.",
                    });
                    return;
                  } else if (result.affectedRows < 1) {
                    res.json({
                      success: false,
                      msg: "Database insert issue.",
                    });
                    return;
                  }
                  {
                    res.json({
                      success: true,
                      id: result.insertId,
                    });
                  }
                }
              );
            }
          }
        );
      console.log(req.body.name + "&&" + req.file.filename);
    });
  }
}

module.exports = ImageRouter;
