import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

async function getBuildVersion() {
  try {
    const buildIdPath = join(process.cwd(), ".next", "BUILD_ID");
    const buildId = await readFile(buildIdPath, "utf8");
    return buildId.trim();
  } catch {
    return process.env.NODE_ENV === "development" ? "development" : "unknown";
  }
}

export const GET = withApiHandler(async () => {
  const version = await getBuildVersion();

  return NextResponse.json(
    {
      version,
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
});
