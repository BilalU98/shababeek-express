const express = require("express");
const router = express.Router();
const users_coupons = require("../controllers/users_coupons.controller");

router.get("/getAll", users_coupons.getAllDetails);
router.post("/addOne", users_coupons.addOneUserCoupon);

// router.delete("/removeOne/:id", coupon.removeOneCoupon);

module.exports = router;
