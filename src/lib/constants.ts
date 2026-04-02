export const SESSION_COOKIE_NAME = "hidden_session";
export const SESSION_TTL_DAYS = 30;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const BOX_TITLE_MAX_LENGTH = 60;
export const BOX_DESCRIPTION_MAX_LENGTH = 240;
export const SLUG_MIN_LENGTH = 3;
export const SLUG_MAX_LENGTH = 40;
export const QUESTION_MIN_LENGTH = 3;
export const QUESTION_MAX_LENGTH = 500;
export const ANSWER_MIN_LENGTH = 1;
export const ANSWER_MAX_LENGTH = 1200;
export const INVITE_CODE_MAX_LENGTH = 32;
export const RATE_LIMIT_WINDOW_MINUTES = 60;
export const RATE_LIMIT_SUBMISSIONS_PER_WINDOW = 5;
