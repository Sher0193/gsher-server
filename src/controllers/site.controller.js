const fs = require("fs");
const path = require("path");

exports.getStatement = (req, res) => {
  try {
    let statementJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../../public/files/statement.json"))
    );
    res.json({
      success: true,
      data: statementJson,
    });
  } catch (e) {
    res.json({
      success: false,
    });
  }
};

exports.postStatement = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const body = req.body;
  console.log(body);
  jsonLines = JSON.stringify(body.lines);
  console.log(jsonLines);
  fs.writeFile(
    path.join(__dirname, "../../public/files/statement.json"),
    jsonLines,
    function (err) {
      if (err) {
        res.json({
          success: false,
          msg: err,
        });
      } else {
        res.json({
          success: true,
          data: jsonLines,
        });
      }
    }
  );
};

exports.getAbout = (req, res) => {
  try {
    let aboutJson = require("../../public/files/about.json");
    res.json({
      success: true,
      data: aboutJson,
    });
  } catch (e) {
    res.json({
      success: false,
    });
  }
};

exports.postAbout = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const body = req.body;
  console.log(body);
  jsonLines = JSON.stringify(body.lines);
  console.log(jsonLines);
  fs.writeFile(
    path.join(__dirname, "../../public/files/about.json"),
    jsonLines,
    function (err) {
      if (err) {
        res.json({
          success: false,
          msg: err,
        });
      } else {
        res.json({
          success: true,
          data: jsonLines,
        });
      }
    }
  );
};
