const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);
brandSchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Brand", brandSchema);
