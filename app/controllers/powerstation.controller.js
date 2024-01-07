const db = require("../models");
const PowerStation = db.powerstation;

// Create and Save a new Power Station
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    return res.status(400).send({ message: "Power Station name can not be empty!" });
  }
  if (!req.body.station_id) {
    return res.status(400).send({ message: "Power Station ID can not be empty!" });
  }
  if (!req.body.location) {
    return res.status(400).send({ message: "Power Station location can not be empty!" });
  }
  if (!req.body.wattage) {
    return res.status(400).send({ message: "Power Station wattage can not be empty!" });
  }

  const powerStation = new PowerStation({
    name: req.body.name,
    station_id: req.body.station_id,
    location: req.body.location,
    wattage: req.body.wattage,
    image_url: req.body.image_url,
    status: req.body.status,
    note: req.body.note,
  });

  try {
    const data = await powerStation.save();
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while creating the PowerStations.",
    });
  }
};

// Retrieve all Power Station from the database.
exports.findAll = async (req, res) => {
  try {
    const data = await PowerStation.find({});
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving tutorials.",
    });
  }
};

// Find a single Power Station with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await PowerStation.findById(id);
    if (!data) {
      res
        .status(404)
        .send({ message: "Not found Power Station with id " + id });
    } else {
      res.send(data);
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving Power Station with id=" + id });
  }
};

// Update a PowerStations by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  try {
    const data = PowerStation.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
    if (!data) {
      res.status(404).send({
        message: `Cannot update Power Station with id=${id}. Maybe PowerStations was not found!`,
      });
    } else {
      res.send({ message: "Power Station was updated successfully." });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating PowerStations with id=" + id,
    });
  }
};

// Delete a Power Station with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  try {
    const data = PowerStation.findByIdAndRemove(id, { useFindAndModify: false });
    if (!data) {
      res.status(404).send({
        message: `Cannot delete Power Station with id=${id}. Maybe Power Station was not found!`,
      });
    } else {
      res.send({
        message: "Power Station was deleted successfully!",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Could not delete Power Station with id=" + id,
    });
  }
};