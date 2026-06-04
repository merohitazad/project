const { ObjectId } = require("mongodb");
const Favourite = require("../models/favourite");
const Home = require("../models/home");

exports.getIndex = (req, res, next) => {
  Home.fetchAll().then((registeredHomes) => {
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
  Home.fetchAll().then((registeredHomes) => {
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
  const favourite = new Favourite(homeId);
  favourite
    .save()
    .then((result) => {
      console.log("Favourite Added", result);
    })
    .catch((error) => console.log("Error while marking favourite", error))
    .finally(() => res.redirect("/favourites"));
};

exports.getFavouriteList = (req, res, next) => {
  Favourite.getFavourites().then((favourites) => {
    Home.fetchAll().then((registeredHomes) => {
      const favouriteHomes = registeredHomes.filter((home) =>
        favourites.some(
          (favourite) => favourite.houseId == new ObjectId(String(home._id)),
        ),
      );
      res.render("store/favourites", {
        favouriteHomes,
        pageTitle: "My Favourites",
        currentPage: "favourites",
      });
    });
  });
};

exports.postDeleteFavourite = (req, res, next) => {
  const homeId = req.params.homeId;
  Favourite.deleteFavourite(homeId)
    .then((result) => console.log("Favourite Removed", result))
    .catch((error) => console.log("Error while removing favourite", error))
    .finally(() => res.redirect("/favourites"));
};
