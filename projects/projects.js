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
  const project = req.body;
  const { name, description } = req.params;
  if (!project.name || !project.description) {
    return res.status(400).json({
      error: "Please provide a name and description for your project"
    });
  }
  if (project.name && project.description) {
    res.status(200).json(project);
  }
  projectModel.insert({ name, description }).then(({ id }) => {
    projectModel
      .findById(id, res)
      .then(([project]) => {
        res.status(201).json(project);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Error creating project" });
      });
  });
});
