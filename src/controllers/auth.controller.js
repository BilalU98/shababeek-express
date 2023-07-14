const Auth = require("../models/auth.model");
const jwt = require("jsonwebtoken");

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
      email: req.body.email,
      phone: req.body.phone,
      birthOfDate: req.body.birthOfDate,
      address: req.body.address,
      photo: req.body.photo,
      password: req.body.password,
    };

    if (!detalis?.email || !detalis?.password) {
      res.status(400).json({
        status: "failed",
        message: "provide email and password",
      });
      return;
    }
    const user = await Auth.create(detalis);

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
    const { password, email } = req.body;
    // get user by emiail
    if (!email || !password) {
      res.status(400).json({
        status: "failed",
        message: "provide emiail and password",
      });
      return;
    }
    const user = await Auth.findOne({ email });

    // check if password match and user is already existing
    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(400).json({
        status: "failed",
        message: "email or password is wrong !",
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
    const users = await Auth.find();

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
