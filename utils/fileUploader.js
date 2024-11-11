const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
const fs = require("fs");
const { generateImageName } = require("./validateFields");

const R2_ACCESS_KEY = process.env.CLOUDFLARE_ACCESS_KEY;
const R2_SECRET_KEY = process.env.CLOUDFLARE_SECRET_KEY;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const BUCKET_NAME = "hospital";
const REGION = "auto";
const GET_IMAGE = process.env.GET_CLOUDFLARE_IMAGE

const s3 = new S3Client({
  region: REGION,
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

exports.uploadImageToR2 = async (file) => {


    // Create a readable stream from the temporary file path
  const fileStream = fs.createReadStream(file.tempFilePath);
  const imageKey = await generateImageName();

    // Upload the image to R2
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: imageKey, 
      Body: fileStream,
      ContentType: file.mimetype, 
    };

    const response = await s3.send(new PutObjectCommand(uploadParams));
  console.log("Image uploaded:", response);
  
  const imageUrl = `${GET_IMAGE}/${imageKey}`;
  console.log("Image URL:", imageUrl);
  return imageUrl;
}
