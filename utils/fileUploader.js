const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
const fs = require("fs");

const R2_ACCESS_KEY = process.env.CLOUDFLARE_ACCESS_KEY;
const R2_SECRET_KEY = process.env.CLOUDFLARE_SECRET_KEY;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const BUCKET_NAME = "hospital";
const REGION = "auto";

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
  const imageKey = file.name;

    // Upload the image to R2
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: file.name, 
      Body: fileStream,
      ContentType: file.mimetype, 
    };

    const response = await s3.send(new PutObjectCommand(uploadParams));
  console.log("Image uploaded:", response);
  
  const imageUrl = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET_NAME}/${imageKey}`;
  console.log("Image URL:", imageUrl);
  return imageUrl;
    // return response;
    // res
    //   .status(200)
    //   .send({ message: "Image uploaded successfully", data: response });
  // } catch (error) {
  //   console.error("Error uploading image:", error.message);
  // //   res
  // //     .status(500)
  // //     .send({ message: "Error uploading image", error: error.message });
  // }
}
