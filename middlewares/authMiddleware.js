const jwt = require("jsonwebtoken");
require("dotenv").config();

// auth
exports.auth = async (req, res, next) => {
  
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));
    // console.log("AFTER TOKEN EXTRACTION");

    // if token is missing , then return response
    // console.log("auth-token",token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // verify the token
    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      // console.log("decode", decode);
      req.user = decode;
    } catch (error) {
      // verification - issue
      console.log(error);
      console.log(error.message);
      return res.status(402).json({
        success: false,
        message: "token is missing",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// isDoctor
exports.isDoctor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "doctor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for doctors only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, try again",
    });
  }
};

// isPatient
exports.isPatient = async (req, res, next) => {
  console.log("instructor");
  try {
    if (req.user.accountType !== "patient") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Patients only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, try again",
    });
  }
};

// isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, try again",
    });
  }
};
