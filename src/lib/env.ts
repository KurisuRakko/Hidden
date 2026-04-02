import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  APP_URL: z.string().url(),
  SESSION_SECRET: z.string().min(24),
  IP_HASH_SECRET: z.string().min(24),
  MINIO_ENDPOINT: z.string().min(1),
  MINIO_PORT: z.coerce.number().int().positive(),
  MINIO_USE_SSL: z
    .string()
    .optional()
    .transform((value) => value === "true"),
  MINIO_ACCESS_KEY: z.string().min(1),
  MINIO_SECRET_KEY: z.string().min(1),
  MINIO_BUCKET: z.string().min(1),
  MINIO_PUBLIC_URL: z.string().url(),
  SEED_ADMIN_PHONE: z.string().min(1),
  SEED_ADMIN_PASSWORD: z.string().min(8),
  SEED_DEFAULT_INVITE: z.string().min(1),
});

let cachedEnv: z.infer<typeof envSchema> | null = null;

export function getEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(
      `Invalid environment configuration: ${parsed.error.issues
        .map((issue) => issue.path.join("."))
        .join(", ")}`,
    );
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
