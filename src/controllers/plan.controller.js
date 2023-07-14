const Plan = require("../models/plan.model");

exports.details = async (req, res, next) => {
  try {
    const plan = await Plan.find();

    res.status(200).json({
      status: "success",
      data: plan.length > 0 ? plan[0] : {},
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: err,
    });
  }
};

exports.change = async (req, res, next) => {
  try {
    const { isFree, planId } = req.body;

    const plan = await Plan.findByIdAndUpdate(
      planId,
      {
        isFree,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: plan,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: err,
    });
  }
};
