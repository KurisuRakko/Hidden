import { changePassword } from "@/features/auth/service";
import { withApiHandler } from "@/lib/api";
import { requireActiveSession } from "@/lib/auth/session";
import { ok } from "@/lib/http";

export const PATCH = withApiHandler(async (request: Request) => {
  const session = await requireActiveSession();
  const body = await request.json();

  return ok(
    await changePassword({
      userId: session.user.id,
      sessionId: session.id,
      currentPassword: String(body.currentPassword ?? ""),
      newPassword: String(body.newPassword ?? ""),
    }),
  );
}, { localizeErrors: true });
