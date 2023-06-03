const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const cloudinary = require("../cloudinary");
const upload = require("../middleware/multer");

router.post(
  "/add/photo",
  upload.single("photo"),
  asyncHandler(async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  })
);
