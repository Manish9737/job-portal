const {
  findUserByEmail,
  createUser,
  findAllUsers,
  findUserById,
  findByIdAndUpdate,
  findByIdAndDelete,
} = require("../models/user");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");
const generateOTP = require("../utils/otp");
const generateToken = require("../utils/token");
const {
  validateEmail,
  validatePassword,
  validateRole,
} = require("../utils/validators");
const { getApplicationsByUserId } = require("../models/applications");


exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!validateEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format." });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be minimum 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.",
    });
  }

  if (!validateRole(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role. Role must be either 'job-seeker' or 'recruiter'.",
    });
  }

  try {
    const user = await findUserByEmail(email);

    if (user)
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });

    const result = await createUser(name, email, password, role);

    const newUser = await findUserById(result.insertId);

    const token = generateToken(newUser);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User created successfully.",
      user: newUser,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format." });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be minimum 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.",
    });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials!" });

    const token = generateToken(user);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
};

exports.allUsers = async (req, res) => {
  try {
    const users = await findAllUsers();

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error.message);
    return res
      .json(500)
      .status({ success: false, message: "Internal server error !" });
  }
};

exports.getUserbyId = async (req, res) => {
  const { id } = req.params;
  // const cookieId = req.user.id;

  // if (!(id === cookieId)) {
  //   return res.status(401).json({ success: false, message: "Unauthorized!" });
  // }

  try {
    const user = await findUserById(id);

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    return res
      .json(500)
      .status({ success: false, message: "Internal server error !" });
  }
};

exports.updateUserById = async (req, res) => {
  const id = req.params && req.params.id ? req.params.id : req.user.id;
  const updateData = req.body;

  if (req.file) {
    updateData.profileImg = `/images/${req.file.filename}`;
  }

  if (updateData.password && !validatePassword(updateData.password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be minimum 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.",
    });
  }

  try {
    const user = await findUserById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    await findByIdAndUpdate(id, updateData);
    const updatedUser = await findUserById(id);
    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
};

exports.removeUser = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await findUserById(id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found !" });

    const result = await findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });

    const user = await findUserByEmail(email);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found !" });

    const otp = generateOTP();

    await findByIdAndUpdate(user.id, { resetPasswordOTP: otp });

    const subject = "Your OTP for Password Reset";
    const content = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>You have requested to reset your password. Please use the following One-Time Password (OTP) to reset your password:</p>
        <h3 style="color: #333;">${otp}</h3>
        <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Thank you,</p>
        <p>Your Company Name</p>
      </div>
    `;

    await sendEmail(user.email, subject, content);

    res
      .status(200)
      .json({ success: true, message: "OTP has been sent to your email." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { id } = req.user;
  const { OTP } = req.body;

  try {
    const user = await findUserById(id);

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "The user could not be found. Please check your credentials and try again.",
        });
    }

    if (user.resetPasswordOTP !== OTP) {
      return res
        .status(400)
        .json({
          success: false,
          message: "The OTP entered is incorrect. Please try again.",
        });
    }

    res
      .status(200)
      .json({ success: true, message: "OTP verification successful." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, OTP, newPassword } = req.body;

  try {
    if (!email || !OTP || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "All fields are required. Please provide an email, OTP, and new password.",
        });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "The user could not be found. Please check your credentials and try again.",
        });
    }

    if (OTP !== user.resetPasswordOTP) {
      return res
        .status(400)
        .json({ success: false, message: "The OTP entered is incorrect." });
    }

    await findByIdAndUpdate(user.id, {
      password: newPassword,
      resetPasswordOTP: null,
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Password has been reset successfully.",
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

exports.getApplications = async(req, res) => {
  const { id } = req.params;
  try {
    const applications = await getApplicationsByUserId(id);

    res.status(200).json({ success: true, applications})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error!"});
  }
}