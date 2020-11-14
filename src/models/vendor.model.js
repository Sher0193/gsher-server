const sql = require("./db.js");
const Logging = require("../logging.js");

// constructor
const Vendor = function (vendor) {
  (this.vendor_name = vendor.name),
    (this.vendor_link = vendor.link),
    (this.vendor_phone = vendor.phone);
};

Vendor.create = (newVendor, result) => {
  sql.query("INSERT INTO vendors SET ?", newVendor, (err, res) => {
    if (err) {
      Logging.log("error: ", err);
      result(err, null);
      return;
    }
    Logging.log("created vendor ", { id: res.insertId, ...newVendor });
    result(null, { id: res.insertId, ...newVendor });
  });
};

Vendor.findById = (vendId, result) => {
  sql.query(
    `SELECT * FROM vendors WHERE id = ${vendId} LIMIT 1`,
    (err, res) => {
      if (err) {
        Logging.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        //Logging.log("found vendor: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Customer with the id
      result({ kind: "not_found" }, null);
    }
  );
};

Vendor.getAll = (result) => {
  sql.query("SELECT * FROM vendors", (err, res) => {
    if (err) {
      Logging.log("error: ", err);
      result(null, err);
      return;
    }

    //Logging.log("vendors: ", res);
    result(null, res);
  });
};

Vendor.updateById = (vendId, vendor, result) => {
  sql.query(
    "UPDATE vendors SET vendor_name = ?, vendor_link = ?, vendor_phone = ? WHERE id = ?",
    [vendor.vendor_name, vendor.vendor_link, vendor.vendor_phone, vendId],
    (err, res) => {
      if (err) {
        Logging.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      Logging.log("updated vendor: ", { id: vendId, ...vendor });
      result(null, { id: vendId, ...vendor });
    }
  );
};

Vendor.remove = (vendId, result) => {
  sql.query("DELETE FROM vendors WHERE id = ?", vendId, (err, res) => {
    if (err) {
      Logging.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    Logging.log("deleted vendor with id: ", vendId);
    result(null, res);
  });
};

Vendor.removeAll = (result) => {
  sql.query("DELETE FROM vendors", (err, res) => {
    if (err) {
      Logging.log("error: ", err);
      result(null, err);
      return;
    }

    Logging.log(`deleted ${res.affectedRows} vendors`);
    result(null, res);
  });
};

module.exports = Vendor;
