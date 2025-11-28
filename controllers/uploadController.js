const { uploadToS3 } = require("../middleware/uploadImage");

exports.uploadImage = async (req, res) => {
  console.log('req', req.file)
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const imageUrl = await uploadToS3(req.file);

    console.log('imageUrl', imageUrl)

    res.json({
      success: true,
      imageUrl,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Image upload failed" });
  }
};
