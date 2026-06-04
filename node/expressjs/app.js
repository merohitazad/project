// const http = require("http");
const express = require("express");
const app = express();

app.use("/", (req, res, next) => {
  console.log("came in 1st middleware", req.url, req.method);
  next();
});

app.use("/submit-details", (req, res, next) => {
  console.log("came in 2nd middleware", req.url, req.method);
  res.send("<p>Welcome to complete coding</p>");
});

// const server = http.createServer(app);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on address http://localhost:${PORT}`);
});
