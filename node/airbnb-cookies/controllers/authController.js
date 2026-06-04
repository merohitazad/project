const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Airbnb Login",
    currentPage: "login",
    isLoggedIn: false,
    errors: [],
    oldInput: { email: "" },
    user: {},
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).render("auth/login", {
      pageTitle: "Airbnb Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["User does not exist"],
      oldInput: { email },
      user: {},
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).render("auth/login", {
      pageTitle: "Airbnb Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid password"],
      oldInput: { email },
      user: {},
    });
  }

  req.session.isLoggedIn = true;

  req.session.user = {
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userType: user.userType,
  };

  req.session.save((err) => {
    if (err) {
      console.error("Session save error:", err);
    }
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Airbnb Register",
    currentPage: "signup",
    isLoggedIn: false,
    errors: [],
    oldInput: {},
    user: {},
  });
};

exports.postSignup = [
  check("firstName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("First name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name must contain only letters"),

  check("lastName")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name must contain only letters"),

  check("email").trim().isEmail().withMessage("Please enter a valid email"),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain at least one special character"),

  check("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),

  check("userType").isIn(["host", "guest"]).withMessage("Invalid user type"),

  check("terms")
    .equals("on")
    .withMessage("You must accept the terms and conditions"),

  (req, res, next) => {
    const { firstName, lastName, email, userType, password, terms } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Airbnb Register",
        currentPage: "signup",
        isLoggedIn: false,
        errors: errors.array().map((err) => err.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          userType,
          terms,
        },
        user: {},
      });
    }

    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          userType,
        });
        return user.save();
      })
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).render("auth/signup", {
          pageTitle: "Airbnb Register",
          currentPage: "signup",
          isLoggedIn: false,
          errors: [
            "Email already exists or an error occurred while creating the account. Please try again.",
          ],
          oldInput: {
            firstName,
            lastName,
            email,
            userType,
            terms,
          },
          user: {},
        });
      });
  },
];

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
