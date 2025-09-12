const Brand = require("../models/Brand");
const mongoose = require("mongoose");

// GET /api/brands/:categoryId
const getBrandsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const brands = await Brand.find({ category: categoryId }).populate(
      "category",
      "name"
    );

    if (brands.length === 0) {
      return res.json({ name: "Unknown Category", brands: [] });
    }

    const categoryName = brands[0].category?.name || "Category";

    res.json({ name: categoryName, brands });
  } catch (err) {
    console.error("❌ getBrandsByCategory error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/brands
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().populate("category", "name"); // ✅ populate category
    res.json(brands);
  } catch (err) {
    console.error("❌ getAllBrands error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getBrandsByCategory, getAllBrands };
