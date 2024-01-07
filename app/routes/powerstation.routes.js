module.exports = app => {
  const powerstationController = require("../controllers/powerstation.controller.js");
  const authMiddleware = require("../middlewares/auth.middlewares");

  var router = require("express").Router();

  // Create a new Power Station
  router.post("/", authMiddleware.isAuthenticated, powerstationController.create);

  // Retrieve all Power Stations
  router.get("/", authMiddleware.isAuthenticated, powerstationController.findAll);

  // Retrieve a single Power Station with id
  router.get("/:id", authMiddleware.isAuthenticated, powerstationController.findOne);

  // Update a Power Station with id
  router.put("/:id", authMiddleware.isAuthenticated, powerstationController.update);

  // Delete a Power Station with id
  router.delete("/:id", authMiddleware.isAuthenticated, powerstationController.delete);

  app.use("/api/powerstation", router);
};
