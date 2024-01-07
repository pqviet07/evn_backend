module.exports = app => {
    const account = require("../controllers/account.controller.js");

    var router = require("express").Router();

    // Create a new Account
    router.post("/", account.create);

    // Get a single Account with username
    router.get("/:username", account.findOne);

    app.use("/api/account", router);
};
