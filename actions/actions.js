const express = require("express");
const actionModel = require("../data/helpers/actionModel.js");
const projectModel = require("../data/helpers/projectModel.js");
const router = express.Router();

router.get("/", (req, res) => {
  actionModel
    .get()
    .then(actions => res.status(200).json(actions))
    .catch(err => res.status(500).json({ message: "Couldn't get action" }));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  actionModel
    .get(id)
    .then(action => {
      if (action) {
        res.status(200).json(action);
      } else {
        res.status(404).json({ message: "Action with this ID does not exist" });
      }
    })
    .catch(err =>
      res.status(500).json({ message: "Error getting Action information" })
    );
});

router.post("/", (req, res) => {
  const action = req.body;
  if (action.name && action.project_id && action.description && action.notes) {
    res.status(200).json(action);
  }
});
