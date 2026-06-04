const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Step 1: Finding user...");

    const user = await User.findOne({ email });
    console.log("Step 2: User found:", user ? "Yes" : "No");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    console.log("Step 3: Comparing passwords...");

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Step 4: Password match result:", isMatch);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    console.log("Step 5: Checking session object...", typeof req.session);

    req.session.isLoggedIn = true;

    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    console.log("Step 6: Saving session...");
    req.session.save((err) => {
      if (err) {
        console.error("Session save error callback:", err);
        return res
          .status(500)
          .json({ success: false, message: "Failed to create session" });
      }
      console.log("Step 7: Login completely successful!");
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: { username: user.username, email: user.email },
      });
    });
  } catch (error) {
    console.error("GLOBAL CATCH TRIGGERED:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.postSignup = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can contain only letters, numbers and underscores"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character"),

  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { username, email, password } = req.body;

      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            existingUser.username === username
              ? "Username already exists"
              : "Email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        username,
        email,
        password: hashedPassword,
        todoList: [],
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: "Account created successfully",
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to log out" });
    }
    res.clearCookie("connect.sid");

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  });
};

exports.getAuthStatus = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: {
        username: req.session.user.username,
        email: req.session.user.email,
        _id: req.session.user._id,
      },
    });
  }

  return res.status(401).json({
    success: false,
    message: "Not authenticated",
  });
};
