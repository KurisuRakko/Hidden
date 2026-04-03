import assert from "node:assert/strict";
import test from "node:test";
import { QuestionStatus } from "@prisma/client";
import {
  assertQuestionCanBeRestored,
  getRestoredQuestionStatus,
} from "@/features/boxes/question-status";
import { AppError } from "@/lib/http";

test("getRestoredQuestionStatus returns pending when the question has no answer", () => {
  assert.equal(
    getRestoredQuestionStatus({
      publishedAt: null,
      answer: null,
    }),
    QuestionStatus.PENDING,
  );
});

test("getRestoredQuestionStatus returns answered when the question has an active draft answer", () => {
  assert.equal(
    getRestoredQuestionStatus({
      publishedAt: null,
      answer: {
        deletedAt: null,
      },
    }),
    QuestionStatus.ANSWERED,
  );
});

test("getRestoredQuestionStatus returns published when the question was previously published", () => {
  assert.equal(
    getRestoredQuestionStatus({
      publishedAt: new Date("2026-04-03T12:00:00.000Z"),
      answer: {
        deletedAt: null,
      },
    }),
    QuestionStatus.PUBLISHED,
  );
});

test("getRestoredQuestionStatus returns pending when the answer was soft deleted", () => {
  assert.equal(
    getRestoredQuestionStatus({
      publishedAt: new Date("2026-04-03T12:00:00.000Z"),
      answer: {
        deletedAt: new Date("2026-04-03T13:00:00.000Z"),
      },
    }),
    QuestionStatus.PENDING,
  );
});

test("assertQuestionCanBeRestored rejects pending questions", () => {
  assert.throws(
    () => assertQuestionCanBeRestored(QuestionStatus.PENDING),
    (error) =>
      error instanceof AppError &&
      error.status === 400 &&
      error.code === "QUESTION_NOT_BLOCKED",
  );
});

test("assertQuestionCanBeRestored rejects deleted questions", () => {
  assert.throws(
    () => assertQuestionCanBeRestored(QuestionStatus.DELETED),
    (error) =>
      error instanceof AppError &&
      error.status === 400 &&
      error.code === "QUESTION_NOT_BLOCKED",
  );
});
