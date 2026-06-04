const http = require("http");
const sumRequestHandler = require("./sum.js");

const requestHandler = (req, res) => {
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write(
      '<html><head><title>Calculator Practise Set</title></head><body><h1>Welcome to Calculator</h1></br><a href="/calculator">Calculator</a></body></html>',
    );
    return res.end();
  } else if (req.url === "/calculator") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Calculator Practise Set</title></head>");
    res.write("<body>");
    res.write('<form action="/calculator-result" method="POST">');
    res.write("<h1>Enter your numbers:</h1>");
    res.write(
      '<input type="text" name="num1" placeholder="First Number"></br></br>',
    );
    res.write(
      '<input type="text" name="num2" placeholder="Second Number"></br></br>',
    );
    res.write("<button>Sum</button>");
    res.write("</form>");
    res.write("</body>");
    res.write("</html>");
    return res.end();
  } else if (
    req.url.toLowerCase() === "/calculator-result" &&
    req.method == "POST"
  ) {
    return sumRequestHandler(req, res);
  } else {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Calculator Practise Set</title></head>");
    res.write("<body><h1>Page Not Found</h1></body>");
    res.write("</html>");
    return res.end();
  }
};

module.exports = requestHandler;
