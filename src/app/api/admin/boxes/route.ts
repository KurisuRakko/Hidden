import { QuestionBoxStatus } from "@prisma/client";
import { listAdminBoxes } from "@/features/admin/service";
import { requireAdminApi } from "@/lib/auth/guards";
import { errorResponse, getPageFromSearchParams, ok } from "@/lib/http";

export async function GET(request: Request) {
  try {
    await requireAdminApi();
    const { searchParams } = new URL(request.url);

    return ok(
      await listAdminBoxes({
        q: searchParams.get("q") ?? undefined,
        status:
          (searchParams.get("status") as QuestionBoxStatus | "ALL" | null) ??
          "ALL",
        page: getPageFromSearchParams(searchParams.get("page") ?? undefined),
        pageSize: 20,
      }),
    );
  } catch (error) {
    return errorResponse(error);
  }
}
