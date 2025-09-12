const Product = require("../models/Product");

// ✅ Helper: common populate config
const populateConfig = [
  {
    path: "brand",
    select: "name",
    populate: {
      path: "category",
      model: "Category",
      select: "name",
    },
  },
];

// ✅ Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(populateConfig);

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    console.error("❌ getAllProducts error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get products by brand
const getProductsByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const products = await Product.find({ brand: brandId }).populate(
      populateConfig
    );

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this brand",
        products: [],
      });
    }

    res.json({
      success: true,
      brand: products[0].brand?.name || "Unknown Brand",
      category: products[0].brand?.category?.name || "Unknown Category",
      count: products.length,
      products,
    });
  } catch (err) {
    console.error("❌ getProductsByBrand error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate(populateConfig);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error("❌ getProductById error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllProducts, getProductsByBrand, getProductById };
