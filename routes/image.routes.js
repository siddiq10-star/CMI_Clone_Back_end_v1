const express = require("express");
const {
  uploadCategory,
  uploadBrand,
  uploadProduct,
} = require("../config/cloudinary");

const router = express.Router();

// Category Image Upload
router.post("/category", uploadCategory.single("image"), (req, res) => {
  res.json({ message: "✅ Category image uploaded", url: req.file.path });
});

// Brand Image Upload
router.post("/brand", uploadBrand.single("image"), (req, res) => {
  res.json({ message: "✅ Brand image uploaded", url: req.file.path });
});

// Product Image Upload
router.post("/product", uploadProduct.single("image"), (req, res) => {
  res.json({ message: "✅ Product image uploaded", url: req.file.path });
});

module.exports = router;
