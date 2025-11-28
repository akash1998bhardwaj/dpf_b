const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");
require("dotenv").config();

// console.log("AWS_ACCESS_KEY_ID =>", process.env.AWS_ACCESS_KEY_ID);
// console.log("AWS_SECRET_KEY =>", process.env.AWS_SECRET_KEY);
// console.log("Bucket =>", process.env.AWS_S3_BUCKET_NAME);
// console.log("Region =>", process.env.AWS_REGION);

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
if (!process.env.AWS_S3_BUCKET_NAME) {
  throw new Error("AWS_S3_BUCKET_NAME is missing");
}
// Multer memory storage (file buffer me aayega)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only JPG, JPEG, PNG allowed"), false);
  },
});


// Convert to webp and upload manually
const uploadToS3 = async (file) => {
  const webpBuffer = await sharp(file.buffer)
    .webp({ quality: 80 })
    .toBuffer();

  const fileName = `${Date.now()}.webp`;

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: webpBuffer,
    ContentType: "image/webp",
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${fileName}`;
};

module.exports = { upload, uploadToS3 };
