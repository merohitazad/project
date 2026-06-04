// Core Module
const path = require("path");

// External Module
const express = require("express");
const homeRouter = express.Router();

// Local Module
const rootDir = require("../utils/pathUtil");

homeRouter.use("/", (req, res, next) => {
  console.log(req.path, req.method);
  next();
});

homeRouter.get("/", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "home.html"));
});

module.exports = homeRouter;
