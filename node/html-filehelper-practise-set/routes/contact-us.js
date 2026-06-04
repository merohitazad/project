// Core Module
const path = require("path");

// External Module
const express = require("express");
const contactRouter = express.Router();

// Local Module
const rootDir = require("../utils/pathUtil");

contactRouter.get("/contact-us", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "contact-us.html"));
});

contactRouter.post("/contact-us", (req, res, next) => {
  console.log("Form submitted", req.body);
  res.sendFile(path.join(rootDir, "views", "formSubmission.html"));
});

module.exports = contactRouter;
