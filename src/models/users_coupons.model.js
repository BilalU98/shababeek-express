const mongoose = require("mongoose");
const { Schema } = mongoose;

const users_couponsSchema = new Schema({
  userId: {
    type: String,
    required: [true],
  },
  couponId: {
    type: String,
    required: [true],
  },
  dateOfUse: {
    type: Date,
    required: [true],
  },
});

const UsersCoupons = mongoose.model("UsersCoupons", users_couponsSchema);

module.exports = UsersCoupons;
