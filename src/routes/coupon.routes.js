const express = require("express");
const router = express.Router();
const coupon = require("../controllers/coupon.controller");

router.get("/getAll", coupon.getAllCoupons);
router.post("/addOne", coupon.addOneCoupon);

router.delete("/removeOne/:id", coupon.removeOneCoupon);

module.exports = router;
