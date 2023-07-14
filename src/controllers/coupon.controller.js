const Coupon = require("../models/coupon.model");

exports.getAllCoupons = async (req, res, next) => {
  try {
    // create new user

    const coupons = await Coupon.find();

    res.status(200).json({
      status: "success",
      length: coupons.length,
      data: coupons,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: err,
    });
  }
};

exports.addOneCoupon = async (req, res, next) => {
  try {
    // create new user
    const { couponCode, formDate, toDate, minBalanceForUser, couponBalance } =
      req.body;

    const coupon = await Coupon.create({
      couponCode,
      formDate,
      toDate,
      minBalanceForUser,
      couponBalance,
    });

    res.status(200).json({
      status: "success",
      data: coupon,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

exports.removeOneCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findOneAndDelete({ _id: id });
    if (!coupon) {
      res.status(400).json({
        status: "failed",
        message: "provide valid coupon id",
      });

      return;
    }

    res.status(200).json({
      status: "success",
      data: coupon,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "failed",
      data: err,
    });
  }
};
