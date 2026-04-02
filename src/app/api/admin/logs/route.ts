import { AdminTargetType } from "@prisma/client";
import { listAdminLogs } from "@/features/admin/service";
import { withApiHandler } from "@/lib/api";
import { requireAdminApi } from "@/lib/auth/guards";
import { getPageFromSearchParams, ok } from "@/lib/http";

export const GET = withApiHandler(async (request: Request) => {
  await requireAdminApi();
  const { searchParams } = new URL(request.url);

  return ok(
    await listAdminLogs({
      q: searchParams.get("q") ?? undefined,
      targetType:
        (searchParams.get("targetType") as AdminTargetType | "ALL" | null) ??
        "ALL",
      page: getPageFromSearchParams(searchParams.get("page") ?? undefined),
      pageSize: 20,
    }),
  );
});
