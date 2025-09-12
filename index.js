const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const imageRoutes = require("./routes/image.routes");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5174", // your React app URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api/bulk-upload", require("./routes/bulkUpload.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/brands", require("./routes/brand.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/upload-image", imageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
