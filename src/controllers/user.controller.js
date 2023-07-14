const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const Category = require("../models/category.model");
const Plan = require("../models/plan.model");
const { default: mongoose } = require("mongoose");
const createToken = (id) => {
  const token = jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRE,
  });

  return token;
};

exports.signUp = async (req, res) => {
  try {
    // create new user

    const detalis = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      birthOfDate: req.body.birthOfDate,
      address: req.body.address,
      photo: req.body.photo,
      password: req.body.password,
    };
    if (!detalis?.phone || !detalis?.password) {
      res.status(400).json({
        status: "failed",
        message: "provide phone number and password",
      });
      return;
    }
    const user = await User.create(detalis);

    let token = "";
    if (user) {
      token = createToken(user._id);
    }

    res.status(200).json({
      status: "success",
      token,
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "failed",
      error: err,
    });
  }
};

exports.signIn = async (req, res, next) => {
  try {
    // create new user
    const { password, phone } = req.body;
    // get user by phone number
    if (!phone || !password) {
      res.status(400).json({
        status: "failed",
        message: "provide phone number and password",
      });
      return;
    }
    const user = await User.findOne({ phone });

    // check if password match and user is already existing
    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(400).json({
        status: "failed",
        message: "phone number or password is wrong !",
      });
      return;
    }

    // return token

    let token = "";
    if (user) {
      console.log(user);
      token = createToken(user._id);
    }

    res.status(200).json({
      status: "success",
      token,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      error: err,
    });
  }
};

exports.changeLocation = async (req, res, next) => {
  try {
    const { longitude, latitude, userId } = req.body;

    if (!longitude || !latitude || !userId) {
      return res.status(400).json({
        status: "faild",
        message: "please provide longitude , latitude ,userId",
      });
    }

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          location: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
        },
      },
      { new: true }
    );

    // const user = await updated.save();
    res.status(200).json({
      status: "success",
      count: user.length,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      error: err,
    });
  }
};

exports.getAllWorkers = async (req, res, next) => {
  try {
    const latitude = req.body.latitude * 1;
    const longitude = req.body.longitude * 1;

    console.log({ latitude });
    // based  on category
    const categoryId = req.body.categoryId;

    const distance = 5; // 5 KM
    const unitValue = 1000; // M

    const plan = await Plan.find();

    let filter = {};
    if (plan[0].isFree) {
      filter = {
        categories: categoryId, //categories has category id   :)
        isWorker: true,
        active: true,
      };
    } else {
      filter = {
        categories: categoryId, //categories has category id   :)
        isWorker: true,
        active: true,
        subscriptionDate: { $gte: new Date() }, // has subscriptions
      };
    }
    const workers = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },

          maxDistance: distance * unitValue,
          distanceField: "distance",
          spherical: true,
        },
      },

      {
        $addFields: {
          totalRatingAvarage: {
            $round: [{ $divide: ["$rating", "$totalRating"] }, 1],
          },
        },
      },

      {
        $match: {
          ...filter,
        },
      },

      { $sort: { totalRatingAvarage: -1 } },
    ]);

    return res.status(200).json({
      status: "success",
      count: workers.length,
      data: workers,
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      error: e,
    });
  }
};

exports.getOneWorker = async (req, res, next) => {
  try {
    // req.body.userId
    const worker = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.body.userId) } },
      {
        $addFields: {
          totalRatingAvarage: {
            $round: [{ $divide: ["$rating", "$totalRating"] }, 1],
          },
        },
      },
    ]);

    if (worker.length === 0) {
      return res.status(404).json({
        status: "failed",
        error: "no worker found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: worker[0],
    });
  } catch (e) {
    console.log({ e });
    res.status(500).json({
      status: "failed",
      error: e,
    });
  }
};

exports.addWorker = async (req, res, next) => {
  try {
    const categories = req.body.categories;
    const userId = req.body.userId;

    if (!userId || !categories) {
      return res.status(400).json({
        status: "faild",
        message: "please add user id and categories !",
      });
    }

    const isUser = await User.findById(userId);
    if (!isUser || !isUser.active) {
      return res.status(404).json({
        status: "faild",
        message: "please add vaild user",
      });
    }

    const isCategory = await Category.find({
      _id: { $in: categories },
    });

    if (isCategory.length == 0) {
      return res.status(404).json({
        status: "faild",
        message: "please provide a vaild categories",
      });
    }

    const valitCategories = isCategory.map((cat) => cat._id);

    const updated = await User.findByIdAndUpdate(
      userId,
      { categories: valitCategories, isWorker: true },
      {
        new: true,
        runValidators: true,
      }
    );
    const worker = await updated.save();

    return res.status(200).json({
      status: "success",
      data: worker,
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      error: e,
    });
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const detalis = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      birthOfDate: req.body.birthOfDate,
      address: req.body.address,
      photo: req.body.photo,
      experience: req.body.experience,
    };

    const authHeader = req.headers.authorization;

    // Check if the authorization header exists and is valid
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(400).json({
        status: "failed",
        error: "make sure to send Bearer token !",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const updated = await User.findByIdAndUpdate(decoded.id, detalis, {
      new: true,
      runValidators: true,
    });
    const user = await updated.save();

    return res.status(200).json({
      status: "success",

      data: user,
    });
  } catch (e) {
    console.log({ e });
    res.status(500).json({
      status: "failsssed",
      error: e,
    });
  }
};

exports.rateWorker = async (req, res) => {
  const authHeader = req.headers.authorization;
  const workerId = req.body.workerId;
  const newRating = req.body.newRating;

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

  jwt.verify(token, process.env.TOKEN_SECRET);

  try {
    // Decode the token to get the payload

    const worker = await User.findById({ _id: workerId });
    if (!worker)
      return res.status(400).json({
        status: "failed",
        error: "worker is not exist !",
      });

    const totalRating = worker.totalRating + 1;
    const rating = worker.rating + newRating;

    const updateWorkerRating = await User.findByIdAndUpdate(
      workerId,
      {
        rating,
        totalRating,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "sucess",
      data: {
        ...updateWorkerRating._doc,
        totalRatingAvarage: parseFloat(
          (updateWorkerRating.rating / updateWorkerRating.totalRating).toFixed(
            1
          )
        ),
      },
    });
  } catch (err) {
    // Handle token validation errors

    res.status(500).json({
      status: "failed",
      error: err,
    });
  }
};

exports.getUserByToken = async (req, res) => {
  try {
    const authHeader = req.body?.token;
    console.log(authHeader);
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

    // Decode the token to get the payload
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const userDetails = await User.findById({ _id: user.id });
    if (!userDetails)
      return res.status(400).json({
        status: "failed",
        error: "user is not exist !",
      });

    res.status(200).json({
      status: "sucess",
      data: userDetails,
    });
  } catch (err) {
    // Handle token validation errors
    console.log({ err });
    res.status(500).json({
      status: "failed",
      error: err,
    });
  }
};
