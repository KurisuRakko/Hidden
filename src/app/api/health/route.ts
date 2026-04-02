import { NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api";
import { checkDatabaseHealth } from "@/lib/db";
import { checkStorageHealth } from "@/lib/storage/minio";

export const GET = withApiHandler(async () => {
  const checks = {
    db: "ok" as "ok" | "error",
    storage: "ok" as "ok" | "error",
  };

  await Promise.all([
    checkDatabaseHealth().catch(() => {
      checks.db = "error";
    }),
    checkStorageHealth().catch(() => {
      checks.storage = "error";
    }),
  ]);

  const status = checks.db === "ok" && checks.storage === "ok" ? "ok" : "degraded";

  return NextResponse.json(
    {
      status,
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: status === "ok" ? 200 : 503 },
  );
});
