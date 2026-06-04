const mongoose = require("mongoose");
const Favourite = require("./favourite");

const homeSchema = new mongoose.Schema({
  houseName: {
    type: String,
    required: true,
  },
  pricePerNight: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  imageLink: String,
  description: String,
});

// Database level deletion when the host deletes its registered home

homeSchema.pre("findOneAndDelete", async function (next) {
  console.log(
    "Home deletion pre hook initiated. Deleting associated favourites...",
  );
  const homeId = this.getQuery()._id;
  await Favourite.deleteMany({ houseId: homeId });
});

module.exports = mongoose.model("Home", homeSchema);
