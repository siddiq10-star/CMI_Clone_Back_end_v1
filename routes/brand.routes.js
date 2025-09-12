const express = require("express");
const Brand = require("../models/Brand");
const { getBrandsByCategory } = require("../controllers/brand.controller");

const router = express.Router();

// GET brands by category (more specific route first)
router.get("/:categoryId", getBrandsByCategory);

// GET all brands
router.get("/", async (req, res) => {
  try {
    const brands = await Brand.find()
      .select("name image category")
      .populate("category", "name");
    res.json(brands);
  } catch (err) {
    console.error("❌ GET /brands error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
