// Requires
const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauceControllers");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-congif");

// Routes
router.post("/", auth, multer, sauceCtrl.addSauce);
router.post("/:id/like", auth, multer, sauceCtrl.giveOpinion);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.get("/", auth, sauceCtrl.getAllSauces);

// Exporting Router
module.exports = router;
