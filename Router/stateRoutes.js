const express = require("express");
const router = express.Router();
const auth = require("../MIddlewares/authMiddleware");
const stateCtrl = require("../Controllers/stateController");

router.post("/", auth, stateCtrl.createState);
router.get("/", auth, stateCtrl.getStates);
router.put("/:id", auth, stateCtrl.updateState);
router.delete("/:id", auth, stateCtrl.deleteState);

module.exports = router;
