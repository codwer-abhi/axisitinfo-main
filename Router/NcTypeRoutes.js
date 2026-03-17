const express = require("express");
const router = express.Router();

const {
createNcType,
getNcTypes,
updateNcType,
deleteNcType
} = require("../Controllers/NcTypeController");

const authMiddleware = require("../MIddlewares/authMiddleware");

router.post("/create",authMiddleware,createNcType);
router.get("/list",authMiddleware,getNcTypes);
router.put("/update/:id",authMiddleware,updateNcType);
router.delete("/delete/:id",authMiddleware,deleteNcType);

module.exports = router;