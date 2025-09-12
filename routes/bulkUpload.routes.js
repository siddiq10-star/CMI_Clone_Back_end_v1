const express = require("express");
const { bulkUpload } = require("../controllers/bulkUpload.controller");
const upload = require("../utils/excelUpload");

const router = express.Router();

// POST /api/bulk-upload
router.post("/", upload.single("file"), bulkUpload);

module.exports = router;
