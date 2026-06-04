const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/databaseUtil");

module.exports = class Home {
  constructor(
    houseName,
    pricePerNight,
    location,
    rating,
    imageLink,
    description,
    _id,
  ) {
    this.houseName = houseName;
    this.pricePerNight = pricePerNight;
    this.location = location;
    this.rating = rating;
    this.imageLink = imageLink;
    this.description = description;
    if (_id) {
      this._id = _id;
    }
  }

  save() {
    if (this._id) {
      // Edit Case
      const db = getDB();
      const updateFields = {
        houseName: this.houseName,
        pricePerNight: this.pricePerNight,
        location: this.location,
        rating: this.rating,
        imageLink: this.imageLink,
        description: this.description,
      };
      return db
        .collection("homes")
        .updateOne(
          { _id: new ObjectId(String(this._id)) },
          { $set: updateFields },
        );
    } else {
      // Add Case
      const db = getDB();
      return db.collection("homes").insertOne(this);
    }
  }

  static fetchAll() {
    const db = getDB();
    return db.collection("homes").find().toArray();
  }

  static findById(homeId) {
    const db = getDB();
    return db
      .collection("homes")
      .find({ _id: new ObjectId(String(homeId)) })
      .next();
  }

  static deleteById(homeId) {
    const db = getDB();
    return db
      .collection("homes")
      .deleteOne({ _id: new ObjectId(String(homeId)) });
  }
};
