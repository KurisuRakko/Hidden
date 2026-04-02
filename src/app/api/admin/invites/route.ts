import { InviteCodeStatus } from "@prisma/client";
import { createInviteCode, listAdminInvites } from "@/features/admin/service";
import { requireAdminApi } from "@/lib/auth/guards";
import { errorResponse, getPageFromSearchParams, ok } from "@/lib/http";

export async function GET(request: Request) {
  try {
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
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdminApi();
    const body = await request.json();
    return ok(await createInviteCode(admin.id, body), 201);
  } catch (error) {
    return errorResponse(error);
  }
}
