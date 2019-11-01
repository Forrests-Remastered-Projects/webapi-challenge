const express = require("express");
const actionModel = require("../data/helpers/actionModel.js");
const projectModel = require("../data/helpers/projectModel.js");
const router = express.Router();

const middleware = (req, res, next) => {
  const { project_id } = req.body;
  projectModel
    .get(project_id)
    .then(response => {
      console.log("middleware working", response);
      response !== null
        ? next()
        : res.status(404).json({ message: "Project ID does not exist" });
    })
    .catch(error => console.log(error));
};

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

router.post("/", middleware, (req, res) => {
  const { description, notes, project_id } = req.body;
  actionModel
    .insert({ description, notes, project_id })
    .then(response => {
      res.status(200).json({ message: "Action inserted!" });
    })
    .catch(error => {
      res.status(500).json({ message: "Server Error" });
    });
});

router.put("/", (req, res) => {
  const { id, project_id, description, notes } = req.body;
  console.log(id, { project_id, description, notes });
  actionModel
    .update(id, { project_id, description, notes })
    .then(response => {
      console.log(response);
      response != null
        ? res.status(200).json({ message: "Updated!" })
        : res.status(404).json({ message: "Project Id does not exist!" });
    })
    .catch(error => res.status(500).json({ message: "Server Error" }));
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  actionModel.get(id).then(action =>
    actionModel
      .remove(id)
      .then(removed => {
        if (removed) {
          res.status(200).json(action);
        } else {
          res.status(404).json({ error: "Project error" });
        }
      })
      .catch(err =>
        res.status(404).json({ message: "Action with ID does not exist" })
      )
  );
});

module.exports = router;
