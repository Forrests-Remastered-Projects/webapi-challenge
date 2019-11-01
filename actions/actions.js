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

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name && !description) {
    return res
      .status(400)
      .json({ error: "Error, must include name and description" });
  }
  actionModel
    .update(id, { name, description })
    .then(updated => {
      if (updated === 1) {
        actionModel.findById(id).then(action => {
          res.status(200).json(action);
        });
        console.log(updated);
      } else {
        res.status(404).json({ error: "Action with id does not exist" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error updating Action" });
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
});
module.exports = router;
