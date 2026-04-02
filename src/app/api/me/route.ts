import { withApiHandler } from "@/lib/api";
import { getCurrentSession } from "@/lib/auth/session";
import { ok } from "@/lib/http";

export const GET = withApiHandler(async () => {
  const session = await getCurrentSession();

  if (!session) {
    return ok({ user: null });
  }

  return ok({
    user: session.user,
  });
});
