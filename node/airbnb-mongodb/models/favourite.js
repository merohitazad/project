const { getDB } = require("../utils/databaseUtil");

module.exports = class Favourite {
  constructor(houseId) {
    this.houseId = houseId;
  }

  save() {
    const db = getDB();

    return db
      .collection("favourites")
      .findOne({ houseId: this.houseId })
      .then((existingFavourite) => {
        if (existingFavourite) {
          console.log("Already Marked Favourite");
          return Promise.resolve();
        }
        return db.collection("favourites").insertOne(this);
      });
  }

  static getFavourites() {
    const db = getDB();
    return db.collection("favourites").find().toArray();
  }

  static deleteFavourite(homeId) {
    const db = getDB();
    return db.collection("favourites").deleteOne({ houseId: homeId });
  }
};
