// core Module
const path = require("path");

// External Module
const express = require("express");
const app = express();

// Local Module
const homeRouter = require("./routes/home.js");
const contactRouter = require("./routes/contact-us.js");
const rootDir = require("./Utils/pathUtil.js");

app.use(express.urlencoded({ extended: true }));

app.use(homeRouter);
app.use(contactRouter);

app.use((req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "404.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on address http://localhost:${PORT}`);
});
