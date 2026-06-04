const Favourite = require("../models/favourite");
const Home = require("../models/home");

exports.getIndex = (req, res, next) => {
  Home.fetchAll().then(([registeredHomes, fields]) => {
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
  Home.fetchAll().then(([registeredHomes, fields]) => {
    res.render("store/home-list", {
      registeredHomes,
      pageTitle: "Airbnb Homes",
      currentPage: "home",
    });
  });
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then(([homes]) => {
    const home = homes[0];
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

exports.getFavouriteList = (req, res, next) => {
  Favourite.getFavourites().then(([favourites]) => {
    Home.fetchAll().then(([registeredHomes, fields]) => {
      const favouriteHomes = registeredHomes.filter((home) =>
        favourites.some((favourite) => favourite.id == home._id),
      );
      console.log(favouriteHomes, registeredHomes, favourites);
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
  Favourite.deleteFavourite(homeId);
  res.redirect("/favourites");
};

exports.postAddToFavourites = (req, res, next) => {
  Favourite.addToFavourite(req.body.id);
  res.redirect("/favourites");
};
