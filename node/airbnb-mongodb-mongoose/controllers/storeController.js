const { ObjectId } = require("mongodb");
const Favourite = require("../models/favourite");
const Home = require("../models/home");

exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes,
      pageTitle: "airbnb home",
      currentPage: "index",
    });
  });
};

exports.getHomes = (req, res, next) => {
  // console.log(registeredHomes);
  // res.sendFile(path.join(rootDir, "views", "home.ejs"));
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes,
      pageTitle: "Airbnb Homes",
      currentPage: "home",
    });
  });
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home,
        pageTitle: "Home Detail",
        currentPage: "home",
      });
    }
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
  });
};

exports.postAddToFavourites = (req, res, next) => {
  const homeId = req.body.id;
  Favourite.findOne({ houseId: homeId }).then((favourite) => {
    if (favourite) {
      console.log("Already marked as favourite");
      res.redirect("/favourites");
    } else {
      favourite = new Favourite({ houseId: homeId });
      favourite
        .save()
        .then((result) => {
          console.log("Favourite Added", result);
        })
        .catch((error) => console.log("Error while marking favourite", error))
        .finally(() => res.redirect("/favourites"));
    }
  });
};

exports.getFavouriteList = (req, res, next) => {
  Favourite.find()
    .populate("houseId")
    .then((favourites) => {
      const favouriteHomes = favourites.map((favourite) => favourite.houseId);

      res.render("store/favourites", {
        favouriteHomes,
        pageTitle: "My Favourites",
        currentPage: "favourites",
      });
    })
    .catch((error) => console.log("Error while fetching favourites"));
};

exports.postDeleteFavourite = (req, res, next) => {
  const homeId = req.params.homeId;
  Favourite.findOneAndDelete({ houseId: homeId })
    .then((result) => console.log("Favourite Removed", result))
    .catch((error) => console.log("Error while removing favourite", error))
    .finally(() => res.redirect("/favourites"));
};
