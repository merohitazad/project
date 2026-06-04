const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGODB_URI)
    .then((client) => {
      console.log("Connected successfully");

      _db = client.db();

      callback();
    })
    .catch((error) => console.log("Error while connecting to mongo", error));
};

const getDB = () => {
  if (!_db) {
    throw new Error("Mongo not connected");
  }

  return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
