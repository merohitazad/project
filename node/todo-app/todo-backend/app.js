// Core Module
const path = require("path");

// External Modules
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

// Local Modules
const { todoItemsRouter } = require("./routes/todoItemsRouter");
const rootDir = require("./utils/pathUtil");
const { authRouter } = require("./routes/authRouter");

const app = express();

app.set('trust proxy', 1);

const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));
app.use(express.json());

const allowedPattern = /project-.*\.vercel\.app$/;

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin === CORS_ORIGIN || allowedPattern.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));

const sessionStore = MongoStore.create({ 
  mongoUrl: MONGODB_URI 
});

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: true,      
      sameSite: "none",  
    },
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/todo", todoItemsRouter);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to mongodb");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log("Error while connecting to mongoose", error));