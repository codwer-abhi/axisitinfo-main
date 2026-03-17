const express = require("express");

const router = express.Router();

const {

createRewardPoint,
getRewardPoints,
updateRewardPoint,
deleteRewardPoint

} = require("../Controllers/rewardPointController");



router.post("/reward-point",createRewardPoint);

router.get("/reward-point",getRewardPoints);

router.put("/reward-point/:id",updateRewardPoint);

router.delete("/reward-point/:id",deleteRewardPoint);


module.exports = router;