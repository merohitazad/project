const mongoose = require("mongoose");

const adminTodoSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

const adminSchema = new mongoose.Schema(
  {
    todoList: [adminTodoSchema],
  },
  { timestamps: true },
);

// Explicitly target the collection 'admins' where Mongoose has created your array
module.exports = mongoose.model("Admin", adminSchema, "admins");