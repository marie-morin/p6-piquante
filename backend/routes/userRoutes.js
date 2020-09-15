// Requires
const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userControllers");
const bouncer = require("express-bouncer")(30000, 60000, 3); // Disables user to try to login more then 3 times in a 30-30s range with wrong password
const { userValidationRules, validate } = require("../middleware/validator");

// Setting controllers
router.post("/signup", userValidationRules(), validate, userCtrl.signup);
router.post("/login", bouncer.block, userCtrl.login);

// Exporting Router
module.exports = router;
