require("express-async-errors");
const bcrypt = require("bcryptjs");
const saltRounds = 12;
const mongoose = require("mongoose");
const { Schema } = mongoose;

const authSchema = new Schema({
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

  email: {
    type: String,
    required: ["email is required !"],
  },

  photo: String,

  active: {
    type: Boolean,
    default: true,
  },

  phone: {
    type: String,
  },

  rule: {
    type: String,
    enum: ["admin", "superAdmin"],
    default: "admin",
  },

  address: {
    type: String,
  },

  birthOfDate: {
    type: Date,
  },
});

authSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, saltRounds);

    return next();
  } catch (err) {
    return next(err);
  }
});

authSchema.methods.correctPassword = async function (password, hashed) {
  let match = await bcrypt.compare(password, hashed);
  console.log({ match });
  return match;
};

const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;
