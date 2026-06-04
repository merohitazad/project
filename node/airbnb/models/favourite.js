const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");

const favouriteDataPath = path.join(rootDir, "data", "favourite.json");

module.exports = class Favourite {
  static addToFavourite(homeId, callback) {
    Favourite.getFavourites((favourites) => {
      if (favourites.includes(homeId)) {
        return callback("Home is already marked favourite");
      }
      favourites.push(homeId);
      fs.writeFile(favouriteDataPath, JSON.stringify(favourites), (err) => {
        callback(err);
      });
    });
  }

  static getFavourites(callback) {
    fs.readFile(favouriteDataPath, (err, data) => {
      if (err) {
        callback([]);
      } else {
        callback(data.length ? JSON.parse(data) : []);
      }
    });
  }

  static deleteFavourite(homeId, callback) {
    Favourite.getFavourites((favourites) => {
      const newfavourites = favourites.filter((id) => id !== homeId);
      fs.writeFile(favouriteDataPath, JSON.stringify(newfavourites), (err) => {
        callback(err);
      });
    });
  }
};
