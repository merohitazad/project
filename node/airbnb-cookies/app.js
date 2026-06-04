// Core Module
const path = require("path");

// External Module
const express = require("express");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);
const { default: mongoose } = require("mongoose");
const multer = require("multer");

// Local Module
const { storeRouter } = require("./routes/storeRouter");
const { hostRouter } = require("./routes/hostRouter");
const { authRouter } = require("./routes/authRouter");
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errorsController");
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const store = new mongodbStore({
  uri: MONGODB_URI,
  collection: "sessions",
  connectionOptions: {
    ssl: true,
  },
});

const multerOptions = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

app.use(express.urlencoded({ extended: true }));
app.use(multer({ storage: multerOptions, fileFilter }).single("image"));
app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads", express.static(path.join(rootDir, "uploads")));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);

app.use((req, res, next) => {
  req.isLoggedIn = req.session ? req.session.isLoggedIn : false;
  next();
});

app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.use("/host", hostRouter);
app.use(errorsController.pageNotFound);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to mongodb");
    app.listen(PORT, () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log("Error while connecting to mongoose", error));
