const { ObjectId } = require("mongodb");
const Home = require("../models/home");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    // console.log("Registered Homes:", registeredHomes);
    res.render("store/index", {
      registeredHomes,
      pageTitle: "airbnb home",
      currentPage: "index",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHomes = (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "home.ejs"));
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes,
      pageTitle: "Airbnb Homes",
      currentPage: "home",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
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
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    }
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddToFavourites = async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
    console.log("Home added to favourites");
  } else {
    console.log("Home already in favourites");
  }
  res.redirect("/favourites");
};

exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("favourites");

  res.render("store/favourites", {
    favouriteHomes: user.favourites,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.postDeleteFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;

  await User.findByIdAndUpdate(userId, {
    $pull: { favourites: homeId },
  });

  res.redirect("/favourites");
};
