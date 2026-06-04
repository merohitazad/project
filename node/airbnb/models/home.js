const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");

const homeDataPath = path.join(rootDir, "data", "homes.json");

module.exports = class Home {
  constructor(
    houseName,
    pricePerNight,
    location,
    rating,
    imageLink,
    description,
  ) {
    this.houseName = houseName;
    this.pricePerNight = pricePerNight;
    this.location = location;
    this.rating = rating;
    this.imageLink = imageLink;
    this.description = description;
  }

  save() {
    Home.fetchAll((registeredHomes) => {
      if (this.id) {
        // edit home case
        registeredHomes = registeredHomes.map((home) =>
          home._id === this.id ? this : home,
        );
      } else {
        // add home case
        this.id = Math.random().toString();
        registeredHomes.push(this);
      }
      fs.writeFile(homeDataPath, JSON.stringify(registeredHomes), (err) =>
        console.log(err),
      );
    });
  }

  static fetchAll(callback) {
    fs.readFile(homeDataPath, (err, data) => {
      if (err) {
        callback([]);
      } else {
        callback(data.length ? JSON.parse(data) : []);
      }
    });
  }

  static findById(homeId, callback) {
    this.fetchAll((homes) => {
      const homeFound = homes.find((home) => home._id === homeId);
      callback(homeFound);
    });
  }

  static deleteById(homeId, callback) {
    this.fetchAll((homes) => {
      const newHomes = homes.filter((home) => home._id !== homeId);
      fs.writeFile(homeDataPath, JSON.stringify(newHomes), callback);
    });
  }
};
