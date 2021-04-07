const express = require("express");
const app = express();
const fs = require("fs");
const PORT = 3000;

// initializing our db via parsing our json file
let imagesDb = [];

fs.readFile("./database/images.json", (err, data) => {
  if (!err) {
    imagesDb = JSON.parse(data);
  }
});

// initializing body-parser, assets, template engine
const parser = require("body-parser");
app.use(parser.urlencoded({ extended: true }));

app.use("/assets", express.static("./public"));

app.set("view engine", "pug");

// Get request for home page
app.get("/", (req, res) => {
  res.render("index");
});

// Get request for new image form
app.get("/images/new", (req, res) => {
  res.render("new", { show: req.query.success });
});

// Random ID Generator
function generateRandomId() {
  return Math.floor(Math.random() * 99999999999) + 1;
}

// Post request to create new image, then redirect somewhere
app.post("/images", (req, res) => {
  // create new image
  const image = {
    id: generateRandomId(),
    title: req.body.title,
    link: req.body.link,
    archived: false,
  };

  // store it somewhere, then redirect user back
  imagesDb.push(image);
  fs.writeFile("./database/images.json", JSON.stringify(imagesDb), (err) => {
    if (err) {
      res.redirect("/images/new?success=0");
    } else {
      res.redirect("/images/new?success=1");
    }
  });
});

// Get request to list all images
app.get("/images", (req, res) => {
  const images = imagesDb.filter((image) => !image.archived);
  res.render("images", { images: images });
});

// Get request to show one specific image
app.get("/images/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const image = imagesDb.find((image) => image.id === id) || null;

  res.render("image", { image: image });
});

// Get request to specific archived image
app.get("/images/archive/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const image = imagesDb.find((image) => image.id === id) || null;

  res.render("archived-img", { image: image });
});

// Get request to archived image delete button
app.get("/images/archive/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const index = imagesDb.findIndex((image) => image.id === id);

  // Delete from imagesDb array
  imagesDb.splice(index, 1);

  // Update images.json file
  fs.writeFile("./database/images.json", JSON.stringify(imagesDb), (err) => {
    if (err) {
      res.redirect("/archive?success=0");
    } else {
      res.redirect("/archive?success=1");
    }
  });
});

// Get request to delete a particular image, then redirect somewhere
app.get("/images/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const index = imagesDb.findIndex((image) => image.id === id);

  // Delete from imagesDb array
  imagesDb.splice(index, 1);

  // Update images.json file
  fs.writeFile("./database/images.json", JSON.stringify(imagesDb), (err) => {
    if (err) {
      res.redirect("/images?success=0");
    } else {
      res.redirect("/images?success=1");
    }
  });
});

app.get("/images/:id/archive", (req, res) => {
  const id = parseInt(req.params.id);
  const index = imagesDb.findIndex((image) => image.id === id);

  imagesDb[index].archived = true;

  fs.writeFile("./database/images.json", JSON.stringify(imagesDb), (err) => {
    if (err) {
      res.redirect("/images/" + id + "?success=0");
    } else {
      res.redirect("/images/" + id + "?success=1");
    }
  });
});

app.get("/archive", (req, res) => {
  const images = imagesDb.filter((image) => image.archived);

  res.render("archive", { images: images });
});

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
