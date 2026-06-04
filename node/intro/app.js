const http = require("http");

function requestListner(req, res) {
  console.log(req);
}

// http.createServer(requestListner);
const server = http.createServer((req, res) => {
  console.log(req.url, req.method, req.headers);
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Node</title></head>");
    res.write("<body><h1>Welcome to Home</h1></body>");
    res.write("</html>");
    return res.end();
  } else if (req.url === "/products") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Node</title></head>");
    res.write("<body><h1>Products</h1></body>");
    res.write("</html>");
    return res.end();
  } else {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Node</title></head>");
    res.write("<body><h1>Learning Node.js</h1></body>");
    res.write("</html>");
    return res.end();
  }
});

const PORT = 3000;
// server.listen(3000);
server.listen(PORT, () => {
  console.log(`Server running on address http://localhost:${PORT}`);
});
