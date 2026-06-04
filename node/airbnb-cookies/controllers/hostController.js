const { Result } = require("postcss");
const Home = require("../models/home");
const fs = require("fs");

exports.getAddHome = (req, res, next) => {
  res.render("host/add-edit-home", {
    editing: false,
    pageTitle: "Add Home to Airbnb",
    currentPage: "addHome",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
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
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHostHomeList = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes,
      pageTitle: "Airbnb Host Homes",
      currentPage: "hostHomes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.postAddHome = (req, res, next) => {
  console.log("body: ", req.body);
  const { houseName, pricePerNight, location, rating, description } = req.body;

  if (!req.file) {
    console.log("No image file uploaded");
    return res.redirect("/host/add-home");
  }

  const image = req.file.path;

  const home = new Home({
    houseName,
    pricePerNight,
    location,
    rating,
    image,
    description,
  });
  home.save().then(() => console.log("Home saved successfully"));
  res.redirect("/host/host-home-list");
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, pricePerNight, location, rating, description } =
    req.body;

  Home.findById(id)
    .then((home) => {
      home.houseName = houseName;
      home.pricePerNight = pricePerNight;
      home.location = location;
      home.rating = rating;
      home.description = description;

      if (req.file) {
        fs.unlink(home.image, (err) => {
          if (err) {
            console.log("Error while deleting old image", err);
          } else {
            console.log("Old image deleted successfully");
          }
        });
        home.image = req.file.path;
      }

      home
        .save()
        .then((result) => console.log("Home updated successfully"))
        .catch((error) => console.log("Error while updating home", error))
        .finally(() => res.redirect("/host/host-home-list"));
    })
    .catch((error) => {
      console.log("Error while finding home for edit", error);
      res.redirect("/host/host-home-list");
    });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findByIdAndDelete(homeId)
    .then(() => res.redirect("/host/host-home-list"))
    .catch((error) => console.log("Error while deleting", error));
};
