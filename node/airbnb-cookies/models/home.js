const mongoose = require("mongoose");
const User = require("./user");

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
  image: String,
  description: String,
});

// Database level deletion when the host deletes its registered home

homeSchema.pre("findOneAndDelete", async function () {
  console.log(
    "Home deletion pre hook initiated. Removing home from user favourites...",
  );

  const homeId = this.getQuery()._id;

  await User.updateMany(
    {},
    {
      $pull: { favourites: homeId },
    },
  );
});

module.exports = mongoose.model("Home", homeSchema);
