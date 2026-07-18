// Core Module
const path = require("path");

// External Modules
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const { MongoStore } = require("connect-mongo");

// Local Modules
const { todoItemsRouter } = require("./routes/todoItemsRouter");
const { adminRouter } = require("./routes/adminRouter"); // Imported the new Admin Router
const rootDir = require("./utils/pathUtil");
const { authRouter } = require("./routes/authRouter");

require("./jobs/scheduler");

const app = express();

app.set('trust proxy', 1);

const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const PORT = process.env.PORT || 3000;

// Temporary diagnostic log to verify variables load successfully on boot
console.log("Loaded CORS_ORIGIN target:", CORS_ORIGIN);

// Middleware Configuration Layer
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Moved up here to parse incoming JSON payloads early
app.use(express.static(path.join(rootDir, "public")));

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin || 
      origin === CORS_ORIGIN || 
      origin.endsWith('.vercel.app') || 
      origin.includes('localhost') ||
      origin.endsWith('.app.github.dev') || 
      origin === 'https://curly-guide-jjp947rv6rgxfpq5x-5173.app.github.dev' 
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));

// Session Setup
const sessionStore = new MongoStore({ 
  mongoUrl: MONGODB_URI 
});

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 10, // 10 days
      httpOnly: true,
      secure: true,      
      sameSite: "none",  
    },
  }),
);

// Routers mapping layer
app.use("/api/auth", authRouter);
app.use("/api/todo", todoItemsRouter);
app.use("/api/admin/todo", adminRouter); // Mounted the Admin Control Endpoint

// Frontend Single Page Application (SPA) Fallback Route
// This catches all non-API paths (like /admin) and returns index.html so the frontend router can take over
app.get("*", (req, res) => {
  res.sendFile(path.join(rootDir, "public", "index.html"));
});

// Database Connection & Server Boot
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to mongodb");
    
    // 1. Require the scheduler
    const { checkDeadlinesAndNotify } = require("./jobs/scheduler");
    
    // 2. Safely execute the immediate boot-check now that Mongo is connected
    checkDeadlinesAndNotify();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log("Error while connecting to mongoose", error));