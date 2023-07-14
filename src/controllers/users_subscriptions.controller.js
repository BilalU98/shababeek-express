const User = require("../models/user.model");
const Subscription = require("../models/subscription.model");
const UsersSubscriptions = require("../models/users_subscrioptions.model");
const moment = require("moment");
const Auth = require("../models/auth.model");
const jwt = require("jsonwebtoken");

exports.getAllActions = async (req, res, next) => {
  try {
    // create new user

    const Users_Subscriptions = await UsersSubscriptions.find()
      .populate("subscription")
      .populate("user")
      .populate("admin");

    res.status(200).json({
      status: "success",
      length: Users_Subscriptions.length,
      data: Users_Subscriptions,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: err,
    });
  }
};

exports.addOneAction = async (req, res, next) => {
  try {
    const { userId, subscriptionId } = req.body;

    if (!userId || !subscriptionId)
      return res.status(401).json({
        status: "faild",
        message: "please provide user id and subscription id !",
      });

    const user = await User.find({ _id: userId });
    const sub = await Subscription.find({ _id: subscriptionId });

    if (!user.length > 0)
      return res.status(401).json({
        status: "faild",
        message: "please provide valid user id  !",
      });

    if (!sub.length > 0)
      return res.status(401).json({
        status: "faild",
        message: "please provide valid subscription id !",
      });

    const authHeader = req.headers["authorization"];
    // Check if the authorization header exists and is valid
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(400).json({
        status: "failed",
        error: "make sure to send Bearer token !",
      });
      return;
    }

    // Get the JWT token from the authorization header
    const token = authHeader.split(" ")[1];
    console.log(token);

    // Decode the token to get the payload
    const admin = jwt.verify(token, process.env.TOKEN_SECRET);
    const adminDetails = await Auth.findById({ _id: admin.id });
    if (!adminDetails)
      return res.status(400).json({
        status: "failed",
        error: "admin is not exist !",
      });

    // add month to user subs date

    const userSubsDate = moment(user[0].subscriptionDate);
    const newDate = userSubsDate.add(sub[0].subscriptionTimeMonth, "months");
    console.log(newDate, sub[0].subscriptionTimeMonth);

    await User.findByIdAndUpdate(
      user[0]._id,
      { subscriptionDate: newDate },
      {
        new: true,
      }
    );

    const newRecord = await UsersSubscriptions.create({
      user: userId,
      admin: admin.id,
      subscription: subscriptionId,
      dateOfAction: moment.now(),
      subscriptionDateBeforeAction: user[0].subscriptionDate,
      subscriptionDateAfterAction: newDate,
    });

    res.status(200).json({
      status: "success",
      data: newRecord,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};
