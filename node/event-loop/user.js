const fs = require("fs");

const userRequestHandler = (req, res) => {
  console.log(req.url, req.method);
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Node</title></head>");
    res.write("<body>");
    res.write("<h1>Enter your details:</h1>");
    res.write('<form action="/submit-details" method="POST">');
    res.write(
      '<input type="text" name="username" placeholder="Enter your Name">',
    );
    res.write("<h2>Gender</h2>");
    res.write('<input type="radio" id="male" name="gender" value="male">');
    res.write('<label for="male">Male</label></br>');
    res.write('<input type="radio" id="female" name="gender" value="female">');
    res.write('<label for="female">Female</label></br></br>');
    res.write('<input type="submit" value="Submit">');
    res.write("</form>");
    res.write("</body>");
    res.write("</html>");
    return res.end();
  } else if (
    req.url.toLowerCase() === "/submit-details" &&
    req.method == "POST"
  ) {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const fullBody = Buffer.concat(body).toString();
      const params = new URLSearchParams(fullBody);
      const bodyObject = Object.fromEntries(params);
      fs.writeFile("user-details", JSON.stringify(bodyObject), (err) => {
        if (err) {
          console.log(err);
        }
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  } else {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Node</title></head>");
    res.write("<body><h1>Page Not Found</h1></body>");
    res.write("</html>");
    return res.end();
  }
};

module.exports = userRequestHandler;
