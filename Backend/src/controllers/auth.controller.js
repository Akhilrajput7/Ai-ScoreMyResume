const UserModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../model/blacklist.model");
const userModel = require("../model/user.model");

require("dotenv").config();

/**
 * @name registerUserController
 * @description register a new user , expects username , email and password in the request body
 * @access Public
 */

async function registerUserController(req, res) {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the details",
      });
    }

    const isUserAlreadyExists = await UserModel.findOne({
      $or: [{ userName }, { email }],
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Account already exists with this email address or username",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      userName,
      email,
      password: hashPassword,
    });
    const payload = {
      id: user._id,
      userName: user.userName,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });

    res.status(201).json({
      success: true,
      message: "user registered successfully",
      id: user._id,
      userName: user.userName,
      email: user.email,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "user cannot be registered",
    });
  }
}

/**
 * @name loginUserController
 * @description Login a  user , expects username , email and password in the request body
 * @access Public
 */

async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email and password",
      });
    }

    const isPasswordVaild = await bcrypt.compare(password, user.password);

    if (!isPasswordVaild) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const payload = {
      id: user._id,
      userName: user.userName,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({
      success: true,
      message: "User loggedIn successfully",
      id: user._id,
      userName: user.userName,
      email: user.email,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "user can not login",
    });
  }
}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */

async function logoutUserController(req, res) {
  try {
    const token = req.cookies.token;
    if (token) {
      await tokenBlacklistModel.create({ token });
    }
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log("cannot logout", error);
    res.status(500).json({
      success: false,
      message: "user cannot logout",
    });
  }
}

/**
 * @name getMeController
 * @description get the current lgoged in user details
 * @access Private
 */

async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    user: {
      message: "user details fetched successfully",
      id: user._id,
      userName: user.userName,
      email: user.email,
    },
  });
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
