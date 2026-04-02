import { createBoxForOwner, listBoxesForOwner } from "@/features/boxes/service";
import { requireUserApi } from "@/lib/auth/guards";
import { errorResponse, ok } from "@/lib/http";

export async function GET() {
  try {
    const viewer = await requireUserApi();
    return ok(await listBoxesForOwner(viewer.id));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const viewer = await requireUserApi();
    const body = await request.json();
    return ok(await createBoxForOwner(viewer.id, body), 201);
  } catch (error) {
    return errorResponse(error);
  }
}
