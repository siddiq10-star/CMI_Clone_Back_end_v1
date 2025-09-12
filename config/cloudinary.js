const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config(); // make sure env is loaded here too

// 🔹 Debug check
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error("❌ Cloudinary config missing. Check your .env file!");
} else {
  console.log("✅ Cloudinary ready for:", process.env.CLOUDINARY_CLOUD_NAME);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Dynamic folder storage
const getStorage = (folderName) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `cashify_clone/${folderName}`, // auto-organize
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
  });

// Middlewares for each type
const uploadCategory = multer({ storage: getStorage("categories") });
const uploadBrand = multer({ storage: getStorage("brands") });
const uploadProduct = multer({ storage: getStorage("products") });

module.exports = { cloudinary, uploadCategory, uploadBrand, uploadProduct };
