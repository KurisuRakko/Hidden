import { UserStatus } from "@prisma/client";
import { listAdminUsers } from "@/features/admin/service";
import { withApiHandler } from "@/lib/api";
import { requireAdminApi } from "@/lib/auth/guards";
import { getPageFromSearchParams, ok } from "@/lib/http";

export const GET = withApiHandler(async (request: Request) => {
  await requireAdminApi();
  const { searchParams } = new URL(request.url);

  return ok(
    await listAdminUsers({
      q: searchParams.get("q") ?? undefined,
      status: (searchParams.get("status") as UserStatus | "ALL" | null) ?? "ALL",
      page: getPageFromSearchParams(searchParams.get("page") ?? undefined),
      pageSize: 20,
    }),
  );
});
