// Core Module
const path = require("path");

// External Module
const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

// Local Module
const { todoItemsRouter } = require("./routes/todoItemsRouter");
const rootDir = require("./utils/pathUtil");
const { authRouter } = require("./routes/authRouter");

// require("dotenv").config({ path: path.join(rootDir, ".env.development") });

const app = express();

const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));
app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
    },
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/todo", todoItemsRouter);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to mongodb");
    app.listen(PORT, () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log("Error while connecting to mongoose", error));
