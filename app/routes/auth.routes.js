module.exports = app => {
    const authController = require("../controllers/auth.controller.js");

    var router = require("express").Router();

    // Create a new Account (registration)
    router.post("/signup", authController.signup);

    // Login a Account
    router.get("/login", authController.login);

    // Refesh token
    router.post('/refresh', authController.refreshToken);

    app.use("/api/auth", router);
};
