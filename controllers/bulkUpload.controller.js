const xlsx = require("xlsx");
const path = require("path");
const Category = require("../models/Category");
const Brand = require("../models/Brand");
const Product = require("../models/Product");
const { cloudinary } = require("../config/cloudinary");
const fs = require("fs");

// 🔹 Helper to upload image only if needed
const uploadIfNeeded = async (fileName, folder) => {
  if (!fileName) return "";

  // Already a Cloudinary URL → return directly
  if (fileName.startsWith("http")) return fileName;

  const publicId = `cashify_clone/${folder}/${fileName.split(".")[0]}`;
  console.log("🔍 Checking Cloudinary publicId:", publicId);

  try {
    // ✅ Try to fetch existing image
    const existing = await cloudinary.api.resource(publicId, {
      resource_type: "image",
    });
    console.log("✅ Found existing on Cloudinary:", existing.secure_url);
    return existing.secure_url;
  } catch (error) {
    const msg =
      (error.error && error.error.message) ||
      error.message ||
      JSON.stringify(error);

    // Handle only 404 → upload new
    if (error.http_code === 404 || msg.includes("Resource not found")) {
      const localPath = path.join(__dirname, "../uploads", fileName);
      console.log("📂 Uploading new file from:", localPath);

      if (!fs.existsSync(localPath)) {
        console.warn(`⚠️ Missing local file: ${localPath}`);
        return ""; // Or use a default placeholder URL
      }

      const result = await cloudinary.uploader.upload(localPath, {
        folder: `cashify_clone/${folder}`,
        public_id: fileName.split(".")[0],
        overwrite: false,
        resource_type: "image",
      });
      console.log("✅ Uploaded new to Cloudinary:", result.secure_url);
      return result.secure_url;
    }

    // 🚨 Unexpected error
    console.error("❌ Cloudinary API error (unexpected):", msg);
    return "";
  }
};

const bulkUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Read Excel
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    let insertedCategories = 0;
    let insertedBrands = 0;
    let insertedProducts = 0;

    const validCategoryNames = new Set();
    const validBrandKeys = new Set();
    const validProductKeys = new Set();

    for (const row of rows) {
      const categoryName = row.Category?.trim();
      const brandName = row.Brand?.trim();
      const productName = row.Product?.trim();
      const categoryImage = row.CategoryImage?.trim();
      const brandImage = row.BrandImage?.trim();
      const productImage = row.ProductImage?.trim();
      const basePrice = row.BasePrice;

      if (!categoryName || !brandName || !productName) continue;

      // 🔹 Upload or reuse category image
      const categoryImageUrl = await uploadIfNeeded(
        categoryImage,
        "categories"
      );

      const category = await Category.findOneAndUpdate(
        { name: categoryName },
        { name: categoryName, image: categoryImageUrl },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      validCategoryNames.add(category.name);
      if (category.isNew) insertedCategories++;

      // 🔹 Upload or reuse brand image
      const brandImageUrl = await uploadIfNeeded(brandImage, "brands");

      const brand = await Brand.findOneAndUpdate(
        { name: brandName, category: category._id },
        { name: brandName, category: category._id, image: brandImageUrl },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      validBrandKeys.add(`${brand.name}_${category._id}`);
      if (brand.isNew) insertedBrands++;

      // 🔹 Upload or reuse product image
      const productImageUrl = await uploadIfNeeded(productImage, "products");

      const product = await Product.findOneAndUpdate(
        { name: productName, brand: brand._id },
        {
          name: productName,
          basePrice: basePrice || 0,
          image: productImageUrl,
          brand: brand._id,
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      validProductKeys.add(`${product.name}_${brand._id}`);
      if (product.isNew) insertedProducts++;
    }

    // 🔹 Delete categories not in Excel
    await Category.deleteMany({
      name: { $nin: Array.from(validCategoryNames) },
    });

    // 🔹 Delete brands not in Excel
    const allBrands = await Brand.find();
    for (const brand of allBrands) {
      const key = `${brand.name}_${brand.category}`;
      if (!validBrandKeys.has(key)) {
        await Brand.deleteOne({ _id: brand._id });
      }
    }

    // 🔹 Delete products not in Excel
    const allProducts = await Product.find();
    for (const product of allProducts) {
      const key = `${product.name}_${product.brand}`;
      if (!validProductKeys.has(key)) {
        await Product.deleteOne({ _id: product._id });
      }
    }

    res.json({
      message: "✅ Bulk upload completed with Cloudinary image sync",
      inserted: {
        categories: insertedCategories,
        brands: insertedBrands,
        products: insertedProducts,
      },
    });
  } catch (error) {
    console.error("❌ Bulk upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { bulkUpload };
