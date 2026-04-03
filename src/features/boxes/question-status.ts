import { QuestionStatus } from "@prisma/client";
import { AppError } from "@/lib/http";

type RestorableQuestionState = {
  publishedAt: Date | null;
  answer: {
    deletedAt: Date | null;
  } | null;
};

export function getRestoredQuestionStatus(question: RestorableQuestionState) {
  const hasActiveAnswer = Boolean(question.answer && !question.answer.deletedAt);

  if (!hasActiveAnswer) {
    return QuestionStatus.PENDING;
  }

  if (question.publishedAt) {
    return QuestionStatus.PUBLISHED;
  }

  return QuestionStatus.ANSWERED;
}

export function assertQuestionCanBeRestored(status: QuestionStatus) {
  if (status === QuestionStatus.REJECTED) {
    return;
  }

  throw new AppError(
    400,
    "Only rejected questions can be restored.",
    "QUESTION_NOT_BLOCKED",
  );
}
