import { InviteCodeStatus } from "@prisma/client";
import { createInviteCode, listAdminInvites } from "@/features/admin/service";
import { withApiHandler } from "@/lib/api";
import { requireAdminApi } from "@/lib/auth/guards";
import { getPageFromSearchParams, ok } from "@/lib/http";

export const GET = withApiHandler(async (request: Request) => {
  await requireAdminApi();
  const { searchParams } = new URL(request.url);

  return ok(
    await listAdminInvites({
      q: searchParams.get("q") ?? undefined,
      status:
        (searchParams.get("status") as InviteCodeStatus | "ALL" | null) ??
        "ALL",
      page: getPageFromSearchParams(searchParams.get("page") ?? undefined),
      pageSize: 20,
    }),
  );
});

export const POST = withApiHandler(async (request: Request) => {
  const admin = await requireAdminApi();
  const body = await request.json();
  return ok(await createInviteCode(admin.id, body), 201);
});
