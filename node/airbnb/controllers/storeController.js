const Favourite = require("../models/favourite");
const Home = require("../models/home");

exports.getIndex = (req, res, next) => {
  Home.fetchAll((registeredHomes) => {
    res.render("store/index", {
      registeredHomes,
      pageTitle: "airbnb home",
      currentPage: "index",
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.fetchAll((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes,
      pageTitle: "Airbnb Homes",
      currentPage: "home",
    });
  });
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.findById(homeId, (home) => {
    if (!home) {
      console.log("Home not found");
      return res.redirect("/homes");
    }

    res.render("store/home-detail", {
      home,
      pageTitle: "Home Detail",
      currentPage: "home",
    });
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
  });
};

exports.getFavouriteList = (req, res, next) => {
  Favourite.getFavourites((favourites) => {
    Home.fetchAll((registeredHomes) => {
      const favouriteHomes = registeredHomes.filter((home) =>
        favourites.includes(home._id),
      );

      res.render("store/favourites", {
        favouriteHomes,
        pageTitle: "My Favourites",
        currentPage: "favourites",
      });
    });
  });
};

exports.postAddToFavourites = (req, res, next) => {
  Favourite.addToFavourite(req.body.id, (error) => {
    if (error) {
      console.log("Error while marking favourite", error);
    }

    res.redirect("/favourites");
  });
};

exports.postDeleteFavourite = (req, res, next) => {
  const homeId = req.params.homeId;

  Favourite.deleteFavourite(homeId, (error) => {
    if (error) {
      console.log("Error while deleting Favourite", error);
    }

    res.redirect("/favourites");
  });
};
