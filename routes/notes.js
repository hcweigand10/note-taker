const express = require("express");
const router = express.Router();
const {
  readAndAppend,
  readFromFile,
  writeToFile,
} = require("../helpers/fsUtils");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// GET existing notes
router.get("/", (req, res) =>
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)))
);

// POST new note
router.post("/", (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, "./db/db.json");

    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } else {
    res.json("Error in posting feedback");
  }
});

router.delete(`/:id`, (req, res) => {
  readFromFile("./db/db.json").then((data) => {
    const id = req.url;
    const db = JSON.parse(data);
    const newArr = db.filter(function (value, index, array) {
      return `/${value.id}` != id;
    });
    console.log("delete");
    fs.writeFile("./db/db.json", JSON.stringify(newArr), (err) =>
      err ? console.error(err) : console.log("Commit logged!")
    );
  });
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

module.exports = router;
