import { createBoxForOwner, listBoxesForOwner } from "@/features/boxes/service";
import { withApiHandler } from "@/lib/api";
import { requireUserApi } from "@/lib/auth/guards";
import { ok } from "@/lib/http";
import {
  getBooleanFromFormData,
  getOptionalFileFromFormData,
  getStringFromFormData,
} from "@/lib/request";

async function parseBoxPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("multipart/form-data")) {
    return request.json();
  }

  const formData = await request.formData();
  const status = getStringFromFormData(formData, "status");

  return {
    title: getStringFromFormData(formData, "title"),
    description: getStringFromFormData(formData, "description"),
    slug: getStringFromFormData(formData, "slug"),
    acceptingQuestions: getBooleanFromFormData(formData, "acceptingQuestions"),
    status: status === "HIDDEN" ? "HIDDEN" : "ACTIVE",
    wallpaper: getOptionalFileFromFormData(formData, "wallpaper"),
    removeWallpaper: getBooleanFromFormData(formData, "removeWallpaper"),
  };
}

export const GET = withApiHandler(async () => {
  const viewer = await requireUserApi();
  return ok(await listBoxesForOwner(viewer.id));
});

export const POST = withApiHandler(async (request: Request) => {
  const viewer = await requireUserApi();
  const body = await parseBoxPayload(request);
  return ok(await createBoxForOwner(viewer.id, body), 201);
});
