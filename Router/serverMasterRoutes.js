const express = require("express");
const router = express.Router();

const {
  createServer,
  getServers,
  updateServer,
  deleteServer
} = require("../Controllers/serverMasterController");

const authMiddleware = require("../MIddlewares/authMiddleware");

/* 🔐 Protected Routes */
router.post("/create", authMiddleware, createServer);
router.get("/list", authMiddleware, getServers);
router.put("/update/:id", authMiddleware, updateServer);
router.delete("/delete/:id", authMiddleware, deleteServer);

module.exports = router;
