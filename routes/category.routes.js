const express = require("express");
const {
  getCategories,
  getCategoryById,
} = require("../controllers/category.controller");

const router = express.Router();

// GET all categories
router.get("/", getCategories);

// GET category by ID
router.get("/:id", getCategoryById);

module.exports = router;
