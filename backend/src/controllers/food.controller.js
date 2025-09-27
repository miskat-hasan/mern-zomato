const foodModel = require("../models/food.model");
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

module.exports = {
  createFood,
  getFoodItems,
};
