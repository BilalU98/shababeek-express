const mongoose = require("mongoose");
const { Schema } = mongoose;

const CouponSchema = new Schema({
  couponCode: {
    type: String,
    required: [true],
  },

  formDate: {
    type: Date,
    required: [true],
  },

  toDate: {
    type: Date,
    required: [true],
  },

  minBalanceForUser: {
    type: String,
    required: [true],
  },

  couponBalance: {
    type: String,
    required: [true],
  },
});

const Coupon = mongoose.model("Coupon", CouponSchema);

module.exports = Coupon;
