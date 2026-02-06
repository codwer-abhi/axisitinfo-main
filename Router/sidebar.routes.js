const express = require("express");
const router = express.Router();
const sidebarData = require("../config/permissions.config.js");
const authMiddleware = require("../MIddlewares/authMiddleware.js");
router.get("/sidebar", authMiddleware, (req, res) => {
  res.json(sidebarData);
});

module.exports = router;
