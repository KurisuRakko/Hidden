import { z } from "zod";
import {
  ANSWER_MAX_LENGTH,
  ANSWER_MIN_LENGTH,
  BOX_DESCRIPTION_MAX_LENGTH,
  BOX_TITLE_MAX_LENGTH,
  INVITE_CODE_MAX_LENGTH,
  QUESTION_MAX_LENGTH,
  QUESTION_MIN_LENGTH,
  SLUG_MAX_LENGTH,
  SLUG_MIN_LENGTH,
} from "@/lib/constants";

const phoneRegex = /^\+?[1-9]\d{6,14}$/;
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizePhone(phone: string) {
  return phone.replace(/[\s()-]/g, "");
}

export function normalizeInviteCode(code: string) {
  return code.trim().toUpperCase();
}

export function normalizeSlug(slug: string) {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

export const phoneSchema = z
  .string()
  .transform(normalizePhone)
  .refine((value) => phoneRegex.test(value), "Enter a valid phone number.");

export const passwordSchema = z
  .string()
  .refine((value) => value.trim().length > 0, "Password is required.");

export const inviteCodeSchema = z
  .string()
  .trim()
  .min(1, "Invite code is required.")
  .max(INVITE_CODE_MAX_LENGTH, "Invite code is too long.")
  .transform(normalizeInviteCode);

export const slugSchema = z
  .string()
  .transform(normalizeSlug)
  .refine(
    (value) =>
      value.length >= SLUG_MIN_LENGTH &&
      value.length <= SLUG_MAX_LENGTH &&
      slugRegex.test(value),
    "Slug must use lowercase letters, numbers, and hyphens only.",
  );

export const boxInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title is too short.")
    .max(BOX_TITLE_MAX_LENGTH, "Title is too long."),
  description: z
    .string()
    .trim()
    .max(BOX_DESCRIPTION_MAX_LENGTH, "Description is too long.")
    .optional()
    .default(""),
  slug: slugSchema,
  acceptingQuestions: z.boolean(),
  status: z.enum(["ACTIVE", "HIDDEN"]).default("ACTIVE"),
});

export const questionTextSchema = z
  .string()
  .trim()
  .min(QUESTION_MIN_LENGTH, "Question is too short.")
  .max(QUESTION_MAX_LENGTH, "Question is too long.");

export const answerTextSchema = z
  .string()
  .trim()
  .min(ANSWER_MIN_LENGTH, "Answer cannot be empty.")
  .max(ANSWER_MAX_LENGTH, "Answer is too long.");

export const inviteFormSchema = z.object({
  code: inviteCodeSchema,
  maxUses: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional()
    .default(null),
  expiresAt: z.string().datetime().nullable().optional().default(null),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
});
