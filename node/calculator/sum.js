const sumRequestHandler = (req, res) => {
  const body = [];
  req.on("data", (chunk) => body.push(chunk));

  req.on("end", () => {
    const fullBody = Buffer.concat(body).toString();
    const params = new URLSearchParams(fullBody);
    const bodyObject = Object.fromEntries(params);
    const sum = Number(bodyObject.num1) + Number(bodyObject.num2);
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Calculator Practise Set</title></head>");
    res.write(`<body><h1>The sum of the two numbers is ${sum}</h1></body>`);
    res.write("</html>");
    return res.end();
  });
};

module.exports = sumRequestHandler;
