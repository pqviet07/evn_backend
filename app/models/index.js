const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.powerstation = require("./powerstation.model.js")(mongoose);
db.account = require("./account.model.js")(mongoose);

module.exports = db;
