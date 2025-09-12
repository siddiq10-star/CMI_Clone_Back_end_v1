const Category = require("../models/Category");

// GET all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error("❌ getCategories error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.json(category);
  } catch (err) {
    console.error("❌ getCategoryById error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getCategories, getCategoryById };
