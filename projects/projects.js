const express = require("express");
const projectModel = require("../data/helpers/projectModel");
const router = express.Router();

router.get("/", (req, res) => {
  projectModel
    .get()
    .then(projects => res.status(200).json(projects))
    .catch(err =>
      res.status(500).json({ message: "Error retrieving project info" })
    );
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  projectModel
    .get(id)
    .then(project => {
      console.log(project);
      if (project) {
        res.status(200).json(project);
      } else {
        res
          .status(404)
          .json({ message: "Project with this ID does not exist" });
      }
    })
    .catch(err =>
      res.status(500).json({ message: "Error getting project information" })
    );
});

router.post("/", (req, res) => {
  const { name, description } = req.body;

  projectModel
    .insert({ name, description })
    .then(response => {
      res.status(200).json({ message: "Project inserted!" });
    })
    .catch(error => {
      res.status(500).json({ message: "Server Error" });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  projectModel
    .update(id, { name, description })
    .then(response =>
      res.status(200).json({ message: "updated", data: response })
    )
    .catch(error => res.status(500).json({ message: "Server Error" }));
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  projectModel
    .remove(id)
    .then(removed => {
      if (removed) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Project with id does not exist" });
      }
    })
    .catch(err => {
      console.log("delete", err);
      res.status(500).json({ error: "Error deleting project" });
    });
});
module.exports = router;
