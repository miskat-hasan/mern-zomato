const foodModel = require("../models/food.model");
const LikeModel = require("../models/likes.model");
const { uploadFile } = require("../services/storage.service");
const { v4: uuid } = require("uuid");

//* Create Food Item
const createFood = async (req, res) => {
  const fileUploadResult = await uploadFile(req.file.buffer, uuid());

  const foodItem = await foodModel.create({
    name: req.body.name,
    video: fileUploadResult.url,
    description: req.body.description,
    foodPartner: req.foodPartner._id,
  });

  res.status(201).json({
    message: "Food item created successfully.",
    food: foodItem,
  });
};

//* Get all Food Item
const getFoodItems = async (req, res) => {
  const foodItems = await foodModel.find({});

  res.status(200).json({
    message: "Food items fetched successfully.",
    foodItems,
  });
};

//* Food Like Controller
const likeFood = async (req, res) => {
  const { foodId } = req.body;
  const user = req.user;

  if (!foodId) {
    return res.status(404).json({
      success: false,
      message: "Food ID is required.",
    });
  }

  const isAlreadyLiked = await LikeModel.findOne({
    user: user._id,
    food: foodId,
  });

  if (isAlreadyLiked) {
    await LikeModel.findOneAndDelete({
      user: user._id,
      food: foodId,
    });

    return res.status(200).json({
      success: true,
      message: "Food disliked successfully.",
    });
  }

  const like = await LikeModel.create({
    user: user._id,
    food: foodId,
  });
  
  res.status(201).json({
    success: true,
    message: "Food Liked Successfully.",
    like,
  });
};

const saveFood = async (req, res) => {};
module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
};
