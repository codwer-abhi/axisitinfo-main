const express = require("express");
const router = express.Router();
const { getUserMenu } = require("../Controllers/sidebar.controller");
const authMiddleware = require("../MIddlewares/authMiddleware");

router.get("/", authMiddleware, getUserMenu);

module.exports = router;
