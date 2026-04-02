import { Client } from "minio";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { getEnv } from "@/lib/env";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/constants";
import { AppError } from "@/lib/http";

let cachedClient: Client | null = null;

function getClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const env = getEnv();

  cachedClient = new Client({
    endPoint: env.MINIO_ENDPOINT,
    port: env.MINIO_PORT,
    useSSL: env.MINIO_USE_SSL,
    accessKey: env.MINIO_ACCESS_KEY,
    secretKey: env.MINIO_SECRET_KEY,
  });

  return cachedClient;
}

export async function ensureStorageBucket() {
  const env = getEnv();
  const client = getClient();
  const exists = await client.bucketExists(env.MINIO_BUCKET);

  if (!exists) {
    await client.makeBucket(env.MINIO_BUCKET);
  }

  await client.setBucketPolicy(
    env.MINIO_BUCKET,
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${env.MINIO_BUCKET}/*`],
        },
      ],
    }),
  );
}

function getExtensionFromMimeType(mimeType: string) {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    default:
      return "";
  }
}

export async function uploadImage(file: File, prefix: string) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    throw new AppError(400, "Only JPG, PNG, or WEBP images are allowed.", "INVALID_FILE_TYPE");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new AppError(400, "Image size must stay below 5 MB.", "FILE_TOO_LARGE");
  }

  const client = getClient();
  const env = getEnv();
  const extension = getExtensionFromMimeType(file.type);
  const objectName = path
    .posix
    .join(prefix, `${Date.now()}-${randomUUID()}${extension}`);

  await client.putObject(
    env.MINIO_BUCKET,
    objectName,
    Buffer.from(await file.arrayBuffer()),
    file.size,
    {
      "Content-Type": file.type,
    },
  );

  return `${env.MINIO_PUBLIC_URL}/${env.MINIO_BUCKET}/${objectName}`;
}
