// External Module
const express = require("express");
const adminRouter = express.Router();

// Local Module
const adminController = require("../controllers/adminController");

// Authentication Gate Route
adminRouter.post("/login", adminController.adminLogin);

// Core routes for bulk managing tasks (Updated paths to handle optional trailing slashes safely)
adminRouter.get("/?", adminController.getAdminTodoItems);
adminRouter.post("/?", adminController.createAdminTodoItem);
adminRouter.delete("/:id", adminController.deleteAdminTodoItem);

exports.adminRouter = adminRouter;