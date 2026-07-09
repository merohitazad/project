// External Module
const express = require("express");
const todoItemsRouter = express.Router();

// Local Module
const todoItemsController = require("../controllers/todoItemsController");

todoItemsRouter.get("/", todoItemsController.getTodoItems);
todoItemsRouter.post("/", todoItemsController.createTodoItem);
todoItemsRouter.delete("/:id", todoItemsController.deleteTodoItem);
todoItemsRouter.put("/:id", todoItemsController.taskCompletionStatus);
todoItemsRouter.post("/save-subscription", todoItemsController.saveSubscription);

exports.todoItemsRouter = todoItemsRouter;
