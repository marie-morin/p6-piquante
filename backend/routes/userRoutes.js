// Requires
const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userControllers");
const bouncer = require("express-bouncer")(30000, 60000, 3);
const { userValidationRules, validate } = require("../middleware/validator");

router.post("/signup", userValidationRules(), validate, userCtrl.signup);
router.post("/login", bouncer.block, userCtrl.login);

// Exporting Router
module.exports = router;
