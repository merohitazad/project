const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use("/", (req, res, next) => {
  console.log(req.url, req.method);
  next();
});

app.get("/", (req, res, next) => {
  console.log(req.url, req.method);
  res.send("<h1>Welcome to complete coding</h1>");
});

app.get("/contact-us", (req, res, next) => {
  console.log(req.url, req.method, req.body);
  res.send(
    `<html><head><title>Enquiry</title></head><body><h1>Enquiry Form</h1><form action="/contact-us" method="POST"><input type="text" name="name" placeholder="Enter your Name"><br><br><input type="email" name="email" placeholder="Enter your Email"><br><br><input type="submit" value="Submit"></form></body></html>`,
  );
});

app.use(bodyParser.urlencoded());

app.post("/contact-us", (req, res, next) => {
  console.log("Form submitted", req.url, req.method, req.body);
  res.send("<h1>Form submitted successfully</h1>");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on address http://localhost:${PORT}`);
});
