const User = require("../models/user");

exports.getTodoItems = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json(user.todoList);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.createTodoItem = async (req, res, next) => {
  try {
    const { task, date, completed } = req.body;
    const user = await User.findById(req.session.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const newTodo = {
      task,
      date,
      completed: completed || false,
    };

    user.todoList.push(newTodo);
    await user.save();

    const createdTodo = user.todoList[user.todoList.length - 1];
    res.status(201).json(createdTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteTodoItem = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(req.session.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.todoList.pull({ _id: id });
    await user.save();

    res.status(200).json({ success: true, id });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.taskCompletionStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(req.session.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const todoItem = user.todoList.id(id);

    if (!todoItem) {
      return res.status(404).json({ message: "Todo item not found" });
    }

    todoItem.completed = !todoItem.completed;
    await user.save();

    res.status(200).json(todoItem);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
