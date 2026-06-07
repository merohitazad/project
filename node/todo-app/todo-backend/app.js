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

const app = express();

app.set('trust proxy', 1);

const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));
app.use(express.json());

const corsOptions = {
  origin: "https://curly-guide-jjp947rv6rgxfpq5x-5173.app.github.dev",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));

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
    app.listen(PORT, () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log("Error while connecting to mongoose", error));