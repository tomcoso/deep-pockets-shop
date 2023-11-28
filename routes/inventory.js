const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("inventory/index", { title: "Deep Pockets Shop" });
});

module.exports = router;
