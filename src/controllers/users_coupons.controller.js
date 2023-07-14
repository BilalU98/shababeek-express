const moment = require("moment/moment");
const User = require("../models/auth.model");
const Coupon = require("../models/coupon.model");
const UsersCoupons = require("../models/users_coupons.model");

exports.getAllDetails = async (req, res, next) => {
  try {
    const allDetails = await UsersCoupons.find();

    res.status(200).json({
      status: "success",
      length: allDetails.length,
      data: allDetails,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: err,
    });
  }
};

exports.addOneUserCoupon = async (req, res, next) => {
  try {
    // create new user
    const { userId, couponId, dateOfUse } = req.body;

    const coupon = await Coupon.findOne({ _id: couponId });

    //  valid coupon
    if (!coupon) {
      res.status(404).json({
        status: "failed",
        message: "please provid a valid coupon",
      });
      return;
    }
    const isExpired = moment.now() > coupon.toDate;
    const isUsed = await UsersCoupons.findOne({
      userId,
      couponId,
    });

    // coupon is expired *out of date / user has used that coupon before*
    if (isExpired || isUsed) {
      res.status(404).json({
        status: "failed",
        message: "this coupon is expired",
      });
      return;
    }

    const user = await User.findByIdAndUpdate(userId, {
      balance: coupon?.couponBalance,
    });
    // valid user
    if (!user) {
      res.status(404).json({
        status: "failed",
        message: "please provid a valid user",
      });
      return;
    }
    const now = moment().format("DD/MM/YYYY");
    const users_coupons = await UsersCoupons.create({
      userId,
      couponId,
      dateOfUse: now,
    });

    res.status(200).json({
      status: "success",
      data: users_coupons,
      user,
      coupon,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};
