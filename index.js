const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const imageRoutes = require("./routes/image.routes");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:5173"];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `❌ The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));



// Routes
app.use("/api/bulk-upload", require("./routes/bulkUpload.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/brands", require("./routes/brand.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/upload-image", imageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
