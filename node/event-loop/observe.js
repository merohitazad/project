const fs = require("fs");

console.log("1. Start of script");

console.log("2. Reading file synchronously");
const dataSync = fs.readFileSync("./user-details", "utf-8");
console.log("3. Synchronously read complete");

console.log("4. Reading file asynchrnously");
fs.readFile("./user-details", "utf-8", (err, dataAsync) => {
  if (err) throw err;
  console.log("6. Asynchronous read complete");
});

console.log("5. End of script");
