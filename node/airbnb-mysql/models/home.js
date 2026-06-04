const db = require("../utils/databaseUtil");

module.exports = class Home {
  constructor(
    houseName,
    pricePerNight,
    location,
    rating,
    imageLink,
    description,
    id,
  ) {
    this.houseName = houseName;
    this.pricePerNight = pricePerNight;
    this.location = location;
    this.rating = rating;
    this.imageLink = imageLink;
    this.description = description;
    this.id = id;
  }

  save() {
    Home.fetchAll().then(([registeredHomes]) => {
      if (this.id) {
        // edit home case
        return db.execute(
          `UPDATE homes SET
    houseName=?,
    pricePerNight=?,
    location=?,
    rating=?,
    imageLink=?,
    description=? WHERE id=?`,
          [
            this.houseName,
            this.pricePerNight,
            this.location,
            this.rating,
            this.imageLink,
            this.description,
            this.id,
          ],
        );
      } else {
        // add home case
        return db.execute(
          `INSERT INTO homes (
    houseName,
    pricePerNight,
    location,
    rating,
    imageLink,
    description
  ) VALUES (?,?,?,?,?,?)`,
          [
            this.houseName,
            this.pricePerNight,
            this.location,
            this.rating,
            this.imageLink,
            this.description,
          ],
        );
      }
    });
  }

  static fetchAll() {
    return db.execute("SELECT * FROM homes");
  }

  static findById(homeId) {
    return db.execute("SELECT * FROM homes WHERE id=?", [homeId]);
  }

  static deleteById(homeId) {
    return db.execute("DELETE FROM homes WHERE id=?", [homeId]);
  }
};
