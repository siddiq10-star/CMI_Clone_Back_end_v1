const express = require("express");
const {
  getAllProducts,
  getProductsByBrand,
  getProductById,
} = require("../controllers/product.controller");

const router = express.Router();

// ✅ Get all products
router.get("/", getAllProducts);

// ✅ Get products by brand (specific route before :id)
router.get("/brand/:brandId", getProductsByBrand);

// ✅ Get single product by ID
router.get("/:id", getProductById);

module.exports = router;
