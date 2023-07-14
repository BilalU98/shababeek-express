const mongoose = require("mongoose");
const { Schema } = mongoose;

const planSchema = new Schema({
  isFree: Boolean,
});

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
