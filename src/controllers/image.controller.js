const multer = require("multer");
const formidable = require("formidable");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const featuredDir = path.join(__dirname, "../../public/img/featured");

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

exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 4000 * 4000 * 5,
  },
  fileFilter: fileFilter,
});

exports.uploadThumbnail = (req, res) => {
  if (!req.file) {
    res.json({
      success: false,
      msg: "Image uploading issue.",
    });
    return;
  }
  sharp(req.file.path)
    .resize(500, null)
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
};

exports.deleteImage = (req, res) => {
  if (req.body.filename) {
    try {
      fs.unlinkSync("public/img/thumbnails/" + req.body.filename);
      fs.unlinkSync("public/img/" + req.body.filename);
      res.json({
        success: true,
        msg: "Removed thumbnail and image file " + req.body.filename,
      });
    } catch (e) {
      console.log(e);
      res.json({
        success: false,
        msg: "Issue removing files.",
      });
      return;
    }
  }
};

exports.featured = (req, res) => {
  fs.readdir(featuredDir, function (err, files) {
    //handling error
    if (err) {
      console.log("Unable to scan directory: " + err);
      res.json({
        success: false,
        msg: "Unable to scan directory " + featuredDir,
      });
      return;
    }
    //     let data = [];
    //     //listing all files using forEach
    //     files.forEach(function (file) {
    //         data.push(file);
    //     });
    res.json({
      success: true,
      data: files,
    });
  });
};
