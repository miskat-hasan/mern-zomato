const express = require("express");
const { createFood, getFoodItems } = require("../controllers/food.controller");
const {
  authFoodPartnerMiddleware,
  authUserMiddleware,
} = require("../middlewares/auth.middleware");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

//* POST /api/food/ [protected]
router.post("/", authFoodPartnerMiddleware, upload.single("video"), createFood);

//* GET /api/food/ [protected]
router.get("/", authUserMiddleware, getFoodItems);

module.exports = router;
