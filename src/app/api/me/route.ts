import { getCurrentSession } from "@/lib/auth/session";
import { errorResponse, ok } from "@/lib/http";

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return ok({ user: null });
    }

    return ok({
      user: session.user,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
