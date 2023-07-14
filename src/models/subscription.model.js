const mongoose = require("mongoose");
const { Schema } = mongoose;
const subscriptionSchema = new Schema({
  subscriptionName: {
    type: String,
    required: ["subscriptionName is required !"],
  },
  subscriptionTimeMonth: {
    type: Number,
    required: ["subscriptionTimeMonth is required !"],
  },

  subscriptionPrice: {
    type: String,
    required: ["subscriptionPrice is required !"],
  },

  active: {
    type: Boolean,
    default: true,
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
