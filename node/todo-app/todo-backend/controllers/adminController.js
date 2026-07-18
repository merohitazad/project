const User = require("../models/user");
const Admin = require("../models/admin"); // Targets the "admins" collection containing the shared todo array
const mongoose = require("mongoose");

// 1. POST: Handle administrative authentication from the singular "admin" collection
exports.adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    // Accessing the singular "admin" collection directly for ID and Password verification
    const credentialCollection = mongoose.connection.collection("admin");
    const admin = await credentialCollection.findOne({ username: username });

    if (!admin) {
      return res.status(401).json({ success: false, message: "Access Denied: Admin user account not found." });
    }

    // Direct string verification comparison against your entry data
    if (admin.password !== password) {
      return res.status(401).json({ success: false, message: "Access Denied: Password mismatch." });
    }

    // Save status flags inside your session store layout
    req.session.isLoggedIn = true;
    req.session.user = { _id: admin._id, username: admin.username, role: "admin" };
    
    await req.session.save();

    res.status(200).json({ success: true, message: "Admin authenticated successfully!" });
  } catch (error) {
    console.error("Admin login validation error:", error);
    res.status(500).json({ success: false, message: "Server error during verification" });
  }
};

// 2. GET: Fetch tasks directly from the global tracking collection ("admins") via the Admin model
exports.getAdminTodoItems = async (req, res, next) => {
  try {
    // Finds the main document containing the tracking todo list array inside the "admins" collection
    const adminDoc = await Admin.findOne({});
    
    if (!adminDoc || !adminDoc.todoList) {
      return res.status(200).json([]);
    }
    
    res.status(200).json(adminDoc.todoList);
  } catch (error) {
    console.error("Error fetching admin todos:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 3. POST: Save broadcast task inside the "admins" collection AND push to all users
exports.createAdminTodoItem = async (req, res, next) => {
  try {
    let { task, date } = req.body;

    if (!task || !date) {
      return res.status(400).json({ success: false, message: "Task and Date are required" });
    }

    if (typeof date === "string" && date.endsWith("Z")) {
      date = date.slice(0, -1);
    }

    const sharedTodoId = new mongoose.Types.ObjectId();

    const newTodo = {
      _id: sharedTodoId,
      task,
      date: new Date(date),
      completed: false,
    };

    // Find the master tracking document inside the "admins" collection
    let adminDoc = await Admin.findOne({});
    if (!adminDoc) {
      adminDoc = new Admin({ todoList: [] });
    }
    adminDoc.todoList.push(newTodo);
    await adminDoc.save();

    // Broadcast the subdocument down to all students simultaneously
    await User.updateMany(
      {}, 
      { $push: { todoList: newTodo } }
    );

    res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error creating admin todo:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 4. DELETE: Wipes the shared task out from the "admins" collection AND every student array profile
exports.deleteAdminTodoItem = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ success: false, message: "Task ID is required" });
    }

    // FIX: Convert the string ID parameter into a proper Mongoose ObjectId for explicit type matching
    const objectId = new mongoose.Types.ObjectId(id);

    // Pull item out from the admin list tracking container document inside "admins"
    await Admin.updateOne(
      {},
      { $pull: { todoList: { _id: objectId } } }
    );

    // Pull item out from every single student user list array matching the broadcast id
    await User.updateMany(
      {},
      { $pull: { todoList: { _id: objectId } } }
    );

    res.status(200).json({ success: true, id });
  } catch (error) {
    console.error("Error deleting admin todo:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};