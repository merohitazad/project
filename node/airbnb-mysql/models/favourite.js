const db = require("../utils/databaseUtil");

module.exports = class Favourite {
  static addToFavourite(homeId) {
    Favourite.getFavourites().then(([favourites]) => {
      if (favourites.some((favourite) => favourite.id == homeId)) {
        // add to favourite
        return console.log("Already added to favourites");
      } else {
        // add home case
        return db.execute(
          `INSERT INTO favourites (
          id
        ) VALUES (?)`,
          [homeId],
        );
      }
    });
  }

  static getFavourites() {
    return db.execute("SELECT * FROM favourites");
  }

  static deleteFavourite(homeId) {
    return db.execute("DELETE FROM favourites WHERE id=?", [homeId]);
  }
};
