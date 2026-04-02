import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const SERIALIZABLE_RETRY_LIMIT = 3;

export function isRetryableTransactionError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2034"
  );
}

export async function runSerializableTransaction<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  let attempt = 0;

  while (attempt < SERIALIZABLE_RETRY_LIMIT) {
    try {
      return await prisma.$transaction(operation, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      attempt += 1;

      if (
        !isRetryableTransactionError(error) ||
        attempt >= SERIALIZABLE_RETRY_LIMIT
      ) {
        throw error;
      }
    }
  }

  throw new Error("Failed to complete transaction after retries.");
}

export async function checkDatabaseHealth() {
  await prisma.$queryRawUnsafe("SELECT 1");
}
