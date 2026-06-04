const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.render("host/add-edit-home", {
    editing: false,
    pageTitle: "Add Home to Airbnb",
    currentPage: "addHome",
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findById(homeId, (home) => {
    if (!home) {
      console.log("Home not found for editing");
      return res.redirect("/host/host-home-list");
    }

    res.render("host/add-edit-home", {
      home: home,
      pageTitle: "Edit Your Home",
      currentPage: "hostHomes",
      editing,
    });
  });
};

exports.getHostHomeList = (req, res, next) => {
  Home.fetchAll((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes,
      pageTitle: "Airbnb Host Homes",
      currentPage: "hostHomes",
    });
  });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, pricePerNight, location, rating, imageLink, description } =
    req.body;

  const home = new Home(
    houseName,
    pricePerNight,
    location,
    rating,
    imageLink,
    description,
  );

  home.save();

  res.redirect("/host/host-home-list");
};

exports.postEditHome = (req, res, next) => {
  const { houseName, pricePerNight, location, rating, imageLink, description } =
    req.body;

  const home = new Home(
    houseName,
    pricePerNight,
    location,
    rating,
    imageLink,
    description,
  );

  home.save();

  res.redirect("/host/host-home-list");
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.deleteById(homeId, (error) => {
    if (error) {
      console.log("Error while deleting home", error);
    }

    res.redirect("/host/host-home-list");
  });
};
