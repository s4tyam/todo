const User = require("../models/user");
const bcrypt = require("bcrypt");
const sendCookies = require("../sendcookies");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const login_function = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not exits, Register First",
      });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (isMatched) {
      sendCookies(user, res, 200, `Welcome Back, ${user.name}`);
    } else {
      res.status(200).json({
        success: false,
        message: "Password not match",
      });
    }
  } catch (err) {
    next(err);
  }
};

const register_function = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({
        success: false,
        message: "User already exit, Login Now",
      });
    }
    const hashed_password = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: hashed_password,
    });
    sendCookies(user, res, 201, `Hello ${name}`);
  } catch (error) {
    next(error);
  }
};

const get_user = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

const logout_function = (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", "null", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Logout successfully",
      });
  } catch (error) {
    next(error);
  }
};
// forget password handling
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "jairaj9661@gmail.com",
    pass: "icqy kzqx tlla zxkm",
  },
});

const send_otp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User With this email not found",
      });
    }

    const otp = crypto.randomBytes(3).toString("hex");
    user.otp = otp;
    user.otpExpiration = Date.now() + 3 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: "jairaj9661@gmail.com",
      to: email,
      subject: "Your OTP for Reset Password for TODO Application",
      text: `Your Otp is: ${otp}`,
    });
    res.status(200).json({
      success: true,
      message: "OTP send Successfully!",
    });
  } catch (error) {
    console.log(`Error occueed in backend and error ${error.message}`);
    res.status(200).json({
      success: false,
      message: "Server Error in Backend",
    });
  }
};

const verify_otp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not Found",
      });
    }

    if (user.otp !== otp || Date.now() > user.otpExpiration) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified. You can now reset your password",
    });
  } catch (error) {
    console.log(`Server error in verify otp ${error.message}`);
    res.status(400).send("Server Error");
  }
};

const reset_password = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not Found",
      });
    }
    const hashed_password = await bcrypt.hash(newPassword, 10);
    user.password = hashed_password;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(`Error in the reset_password function ${error.message}`);
    res.status(200).send("Server errror");
  }
};

module.exports = {
  login_function,
  register_function,
  get_user,
  logout_function,
  send_otp,
  verify_otp,
  reset_password,
};
