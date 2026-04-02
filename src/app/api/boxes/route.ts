import { createBoxForOwner, listBoxesForOwner } from "@/features/boxes/service";
import { withApiHandler } from "@/lib/api";
import { requireUserApi } from "@/lib/auth/guards";
import { ok } from "@/lib/http";

export const GET = withApiHandler(async () => {
  const viewer = await requireUserApi();
  return ok(await listBoxesForOwner(viewer.id));
});

export const POST = withApiHandler(async (request: Request) => {
  const viewer = await requireUserApi();
  const body = await request.json();
  return ok(await createBoxForOwner(viewer.id, body), 201);
});
