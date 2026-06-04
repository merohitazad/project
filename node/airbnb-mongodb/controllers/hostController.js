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

  Home.findById(homeId).then((home) => {
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
  Home.fetchAll().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes,
      pageTitle: "Airbnb Host Homes",
      currentPage: "hostHomes",
    });
  });
};

exports.postAddHome = (req, res, next) => {
  console.log(req.body);
  const {
    id,
    houseName,
    pricePerNight,
    location,
    rating,
    imageLink,
    description,
  } = req.body;
  const home = new Home(
    houseName,
    pricePerNight,
    location,
    rating,
    imageLink,
    description,
    id,
  );
  home.save().then(() => console.log("Home saved successfully"));
  res.redirect("/host/host-home-list");
};

exports.postEditHome = (req, res, next) => {
  const {
    id,
    houseName,
    pricePerNight,
    location,
    rating,
    imageLink,
    description,
  } = req.body;
  const home = new Home(
    houseName,
    pricePerNight,
    location,
    rating,
    imageLink,
    description,
    id,
  );
  home.save();
  res.redirect("/host/host-home-list");
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.deleteById(homeId)
    .then(() => res.redirect("/host/host-home-list"))
    .catch((error) => console.log("Error while deleting", error));
};
