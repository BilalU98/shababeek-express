require("express-async-errors");
const bcrypt = require("bcryptjs");
const saltRounds = 12;
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: ["firstName is required !"],
  },

  lastName: {
    type: String,
    required: ["lastName is required !"],
  },

  password: {
    type: String,
    required: ["password is required !"],
  },

  photo: String,

  totalRating: {
    type: Number,
    default: 1,
  },

  rating: {
    type: Number,
    default: 5,
  },

  categories: {
    type: [String],
  },

  active: {
    type: Boolean,
    default: true,
  },

  phone: {
    type: String,
    required: ["phone is required !"],
  },

  rule: {
    type: String,
    enum: ["user", "admin", "superAdmin"],
    default: "user",
  },

  isWorker: {
    type: Boolean,
    default: false,
  },

  address: {
    type: String,
    // required: ["address is required !"],
  },

  birthOfDate: {
    type: Date,
    // required: ["birthOfDate is required !"],
  },

  location: {
    type: { type: String },
    coordinates: [Number],
  },

  subscriptionDate: {
    type: Date,
  },

  experience: {
    type: String,
    default: "1",
  },
});

userSchema.index({ location: "2dsphere" });

userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, saltRounds);

    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.correctPassword = async function (password, hashed) {
  let match = await bcrypt.compare(password, hashed);
  console.log({ match });
  return match;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
