const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.url, req.method, req.headers);
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Myntra Practise Set</title></head>");
    res.write("<body><nav>");
    res.write('<a href="/home">Home</a></br>');
    res.write('<a href="/men">Men</a></br>');
    res.write('<a href="/women">Women</a></br>');
    res.write('<a href="/kids">Kids</a></br>');
    res.write('<a href="/cart">Cart</a></br>');
    res.write("</nav></body>");
    res.write("</html>");
    return res.end();
  } else if (req.url.toLowerCase() === "/home") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Myntra Practise Set</title></head>");
    res.write("<body><h1>Welcome to Home Section</h1></body>");
    res.write("</html>");
    return res.end();
  } else if (req.url.toLowerCase() === "/men") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Myntra Practise Set</title></head>");
    res.write("<body><h1>Welcome to Men Section</h1></body>");
    res.write("</html>");
    return res.end();
  } else if (req.url.toLowerCase() === "/women") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Myntra Practise Set</title></head>");
    res.write("<body><h1>Welcome to Women Section</h1></body>");
    res.write("</html>");
    return res.end();
  } else if (req.url.toLowerCase() === "/kids") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Myntra Practise Set</title></head>");
    res.write("<body><h1>Welcome to Kids Section</h1></body>");
    res.write("</html>");
    return res.end();
  } else if (req.url.toLowerCase() === "/cart") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Myntra Practise Set</title></head>");
    res.write("<body><h1>Welcome to Cart Section</h1></body>");
    res.write("</html>");
    return res.end();
  } else {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Myntra Practise Set</title></head>");
    res.write("<body><h1>Page not found</h1></body>");
    res.write("</html>");
    return res.end();
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on address http://localhost:${PORT}`);
});
