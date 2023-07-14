const mongoose = require("mongoose");
const { Schema } = mongoose;

const users_subscriptionsSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
  },

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },

  subscriptionDateBeforeAction: Date,
  subscriptionDateAfterAction: Date,

  dateOfAction: {
    type: Date,
    required: [true],
  },
});

const UsersSubscriptions = mongoose.model(
  "UsersSubscriptions",
  users_subscriptionsSchema
);

module.exports = UsersSubscriptions;
