import { QuestionStatus } from "@prisma/client";
import { z } from "zod";
import { updateQuestionStatusForOwner } from "@/features/boxes/service";
import { withApiHandler } from "@/lib/api";
import { requireUserApi } from "@/lib/auth/guards";
import { ok } from "@/lib/http";

const requestSchema = z.object({
  status: z.enum([QuestionStatus.REJECTED, QuestionStatus.DELETED]),
});

type RouteContext = {
  params: Promise<{
    id: string;
    questionId: string;
  }>;
};

export const PATCH = withApiHandler(
  async (request: Request, context: RouteContext) => {
    const viewer = await requireUserApi();
    const body = requestSchema.parse(await request.json());
    const { id, questionId } = await context.params;
    return ok(
      await updateQuestionStatusForOwner(id, questionId, viewer.id, body.status),
    );
  },
);
