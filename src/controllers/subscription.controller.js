const Subscription = require("../models/subscription.model");

exports.getAllSubscriptions = async (req, res, next) => {
  try {
    // create new user

    const Subscriptions = await Subscription.find({ active: true });

    res.status(200).json({
      status: "success",
      length: Subscriptions.length,
      data: Subscriptions,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: err,
    });
  }
};

exports.addOneSubscription = async (req, res, next) => {
  try {
    // create new user
    const { subscriptionName, subscriptionTimeMonth, subscriptionPrice } =
      req.body;
    if (!subscriptionName || !subscriptionTimeMonth || !subscriptionPrice) {
      res.status(400).json({
        status: "failed",
        message: "provide Subscription name and month and price",
      });

      return;
    }

    const subscription = await Subscription.create({
      subscriptionName,
      subscriptionTimeMonth,
      subscriptionPrice,
    });

    res.status(200).json({
      status: "success",
      data: subscription,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

exports.removeOneSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        status: "failed",
        message: "provide Subscription id",
      });

      return;
    }

    const subscription = await Subscription.findByIdAndUpdate(
      id,
      {
        active: false,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: subscription,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: err,
    });
  }
};
