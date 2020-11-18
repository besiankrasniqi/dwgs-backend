const express = require("express");
const imagesController = require("../controllers/images");
const { isAuthenticated } = require("../middleware/is-authenticated");
const router = express.Router();

router.post("/save", isAuthenticated, imagesController.saveImage);
router.get("/list", isAuthenticated, imagesController.images);
router.get("/get-image", isAuthenticated, imagesController.getImage);
router.get("/get-public-image", imagesController.getImage);
router.delete("/delete-image", isAuthenticated, imagesController.deleteImage);

module.exports = router;
