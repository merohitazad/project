// External Module
const express = require("express");
const authRouter = express.Router();

// Local Module
const authController = require("../controllers/authController");

authRouter.post("/login", authController.postLogin);
authRouter.post("/logout", authController.postLogout);
authRouter.post("/signup", authController.postSignup);
authRouter.get("/status", authController.getAuthStatus);

exports.authRouter = authRouter;
