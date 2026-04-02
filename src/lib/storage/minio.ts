import { Client } from "minio";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { getEnvValue } from "@/lib/env";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/constants";
import { AppError } from "@/lib/http";

let cachedClient: Client | null = null;

function getStorageEnv() {
  return {
    endpoint: getEnvValue("MINIO_ENDPOINT"),
    port: getEnvValue("MINIO_PORT"),
    useSSL: getEnvValue("MINIO_USE_SSL"),
    accessKey: getEnvValue("MINIO_ACCESS_KEY"),
    secretKey: getEnvValue("MINIO_SECRET_KEY"),
    bucket: getEnvValue("MINIO_BUCKET"),
    publicUrl: getEnvValue("MINIO_PUBLIC_URL"),
  };
}

function getClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const env = getStorageEnv();

  cachedClient = new Client({
    endPoint: env.endpoint,
    port: env.port,
    useSSL: env.useSSL,
    accessKey: env.accessKey,
    secretKey: env.secretKey,
  });

  return cachedClient;
}

export async function ensureStorageBucket() {
  const env = getStorageEnv();
  const client = getClient();
  const exists = await client.bucketExists(env.bucket);

  if (!exists) {
    await client.makeBucket(env.bucket);
  }

  await client.setBucketPolicy(
    env.bucket,
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${env.bucket}/*`],
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
  const env = getStorageEnv();
  const extension = getExtensionFromMimeType(file.type);
  const objectName = path
    .posix
    .join(prefix, `${Date.now()}-${randomUUID()}${extension}`);

  await client.putObject(
    env.bucket,
    objectName,
    Buffer.from(await file.arrayBuffer()),
    file.size,
    {
      "Content-Type": file.type,
    },
  );

  return `${env.publicUrl}/${env.bucket}/${objectName}`;
}

export async function removeImageByUrl(imageUrl: string) {
  const env = getStorageEnv();
  const publicBaseUrl = `${env.publicUrl}/${env.bucket}/`;

  if (!imageUrl.startsWith(publicBaseUrl)) {
    return;
  }

  const objectName = imageUrl.slice(publicBaseUrl.length);

  if (!objectName) {
    return;
  }

  try {
    await getClient().removeObject(env.bucket, objectName);
  } catch (error) {
    console.error("Failed to remove uploaded image after rollback.", error);
  }
}

export async function checkStorageHealth() {
  const env = getStorageEnv();

  await getClient().bucketExists(env.bucket);
}
