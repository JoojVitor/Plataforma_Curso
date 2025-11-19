import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getRequiredEnv } from "./env";

const region = getRequiredEnv("AWS_REGION");
const accessKeyId = getRequiredEnv("AWS_ACCESS_KEY_ID");
const secretAccessKey = getRequiredEnv("AWS_SECRET_ACCESS_KEY");
const bucket = getRequiredEnv("AWS_S3_BUCKET");

export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function getSignedVideoUrl(key: string) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
}

export async function deleteFromS3( key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    const response = await s3.send(command);
    console.log("Object deleted successfully:", response);
  } catch (error) {
    console.error("Error deleting object:", error);
  }
}