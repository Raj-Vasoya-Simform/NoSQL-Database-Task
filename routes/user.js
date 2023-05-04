const path = require("path");

const express = require("express");

const userController = require("../controllers/user");

const auth = require("../middleware/auth");

const router = express.Router();


// To fetch Posts of the User
router.get("/user", auth, userController.userData);

// To fetch all the Users
router.get("/users", userController.userGet);

router.post("/user/signup", userController.signup);

router.post("/user/signin", userController.signin);

module.exports = router;
