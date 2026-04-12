import { z } from "zod";

const envShape = {
  DATABASE_URL: z.string().min(1),
  APP_URL: z.string().url(),
  ADMIN_APP_URL: z.string().url(),
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
  OIDC_ENABLED: z
    .string()
    .optional()
    .transform((value) => value === "true"),
  OIDC_PROVIDER_LABEL: z
    .string()
    .optional()
    .transform((value) => value?.trim() || "Casdoor"),
  OIDC_ISSUER_URL: z.string().optional(),
  OIDC_CLIENT_ID: z.string().optional(),
  OIDC_CLIENT_SECRET: z.string().optional(),
  OIDC_SCOPES: z
    .string()
    .optional()
    .transform((value) => value?.trim() || "openid profile email phone"),
  OIDC_CALLBACK_PATH: z
    .string()
    .optional()
    .transform((value) => value?.trim() || "/callback"),
  SEED_ADMIN_PHONE: z.string().min(1),
  SEED_ADMIN_PASSWORD: z.string().min(8),
  SEED_DEFAULT_INVITE: z.string().min(1),
} satisfies Record<string, z.ZodType>;

type Env = {
  [Key in keyof typeof envShape]: z.infer<(typeof envShape)[Key]>;
};

let cachedEnv: Env | null = null;
const cachedEnvValues = new Map<keyof Env, Env[keyof Env]>();

export function getEnvValue<Key extends keyof Env>(key: Key): Env[Key] {
  if (cachedEnvValues.has(key)) {
    return cachedEnvValues.get(key) as Env[Key];
  }

  const parsed = (envShape[key] as unknown as z.ZodType<Env[Key]>).safeParse(
    process.env[key],
  );

  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${key}`);
  }

  cachedEnvValues.set(key, parsed.data);

  return parsed.data;
}

export function getEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  const nextEnv = {} as Env;
  const nextEnvRecord = nextEnv as Record<keyof Env, Env[keyof Env]>;

  for (const key of Object.keys(envShape) as Array<keyof Env>) {
    nextEnvRecord[key] = getEnvValue(key);
  }

  cachedEnv = nextEnv;

  return cachedEnv;
}

export function getOidcPublicConfig() {
  const env = getEnv();

  return {
    enabled: env.OIDC_ENABLED,
    providerLabel: env.OIDC_PROVIDER_LABEL,
  };
}

export function getOidcEnv() {
  const env = getEnv();

  if (!env.OIDC_ENABLED) {
    return null;
  }

  if (!env.OIDC_ISSUER_URL?.trim()) {
    throw new Error("Invalid environment configuration: OIDC_ISSUER_URL");
  }

  if (!env.OIDC_CLIENT_ID?.trim()) {
    throw new Error("Invalid environment configuration: OIDC_CLIENT_ID");
  }

  if (!env.OIDC_CLIENT_SECRET?.trim()) {
    throw new Error("Invalid environment configuration: OIDC_CLIENT_SECRET");
  }

  if (!env.OIDC_CALLBACK_PATH.startsWith("/")) {
    throw new Error("Invalid environment configuration: OIDC_CALLBACK_PATH");
  }

  return {
    enabled: true as const,
    providerLabel: env.OIDC_PROVIDER_LABEL,
    issuerUrl: env.OIDC_ISSUER_URL,
    clientId: env.OIDC_CLIENT_ID,
    clientSecret: env.OIDC_CLIENT_SECRET,
    scopes: env.OIDC_SCOPES,
    callbackPath: env.OIDC_CALLBACK_PATH,
  };
}
