import { QuestionBoxStatus } from "@prisma/client";
import { z } from "zod";
import { updateManagedBoxStatus } from "@/features/admin/service";
import { withApiHandler } from "@/lib/api";
import { requireAdminApi } from "@/lib/auth/guards";
import { ok } from "@/lib/http";

const requestSchema = z.object({
  status: z.enum([
    QuestionBoxStatus.ACTIVE,
    QuestionBoxStatus.HIDDEN,
    QuestionBoxStatus.DISABLED,
  ]),
});

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const PATCH = withApiHandler(
  async (request: Request, context: RouteContext) => {
    const admin = await requireAdminApi();
    const { id } = await context.params;
    const body = requestSchema.parse(await request.json());
    return ok(await updateManagedBoxStatus(admin.id, id, body.status));
  },
);
