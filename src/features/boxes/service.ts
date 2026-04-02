import {
  Prisma,
  QuestionBoxStatus,
  QuestionStatus,
  UserRole,
} from "@prisma/client";
import { addMinutes } from "date-fns";
import { createHash } from "node:crypto";
import { prisma, runSerializableTransaction } from "@/lib/db";
import { getEnvValue } from "@/lib/env";
import { AppError } from "@/lib/http";
import {
  RATE_LIMIT_SUBMISSIONS_PER_WINDOW,
  RATE_LIMIT_WINDOW_MINUTES,
} from "@/lib/constants";
import { removeImageByUrl, uploadImage } from "@/lib/storage/minio";
import {
  answerTextSchema,
  boxInputSchema,
  normalizeSlug,
  questionTextSchema,
} from "@/lib/validation/common";

const questionInclude = {
  answer: true,
} satisfies Prisma.QuestionInclude;

function withoutDeletedAnswer<
  T extends {
    answer: {
      deletedAt: Date | null;
    } | null;
  },
>(question: T): T {
  if (!question.answer?.deletedAt) {
    return question;
  }

  return {
    ...question,
    answer: null,
  } as T;
}

async function getOwnedBoxOrThrow(boxId: string, ownerId: string) {
  const box = await prisma.questionBox.findFirst({
    where: {
      id: boxId,
      ownerId,
    },
  });

  if (!box) {
    throw new AppError(404, "Question box not found.", "BOX_NOT_FOUND");
  }

  return box;
}

function hashSubmitterIp(ip: string) {
  return createHash("sha256")
    .update(ip)
    .update(getEnvValue("IP_HASH_SECRET"))
    .digest("hex");
}

export async function listBoxesForOwner(ownerId: string) {
  return prisma.questionBox.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });
}

export async function createBoxForOwner(
  ownerId: string,
  input: {
    title: string;
    description?: string;
    slug: string;
    acceptingQuestions: boolean;
    status?: "ACTIVE" | "HIDDEN";
    wallpaper?: File | null;
  },
) {
  const parsed = boxInputSchema.parse(input);
  let uploadedWallpaperUrl: string | null = null;

  try {
    uploadedWallpaperUrl = input.wallpaper
      ? await uploadImage(input.wallpaper, `boxes/${ownerId}/wallpapers`)
      : null;

    return await prisma.questionBox.create({
      data: {
        ownerId,
        title: parsed.title,
        description: parsed.description || null,
        slug: parsed.slug,
        wallpaperUrl: uploadedWallpaperUrl,
        acceptingQuestions: parsed.acceptingQuestions,
        status: parsed.status,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(409, "Slug is already taken.", "SLUG_TAKEN");
    }

    if (uploadedWallpaperUrl) {
      await removeImageByUrl(uploadedWallpaperUrl);
    }

    throw error;
  }
}

export async function updateBoxForOwner(
  boxId: string,
  ownerId: string,
  input: {
    title: string;
    description?: string;
    slug: string;
    acceptingQuestions: boolean;
    status?: "ACTIVE" | "HIDDEN";
    wallpaper?: File | null;
    removeWallpaper?: boolean;
  },
) {
  const existingBox = await getOwnedBoxOrThrow(boxId, ownerId);
  const parsed = boxInputSchema.parse(input);
  let uploadedWallpaperUrl: string | null = null;

  try {
    uploadedWallpaperUrl = input.wallpaper
      ? await uploadImage(input.wallpaper, `boxes/${ownerId}/wallpapers`)
      : null;

    const wallpaperUrl = uploadedWallpaperUrl
      ?? (input.removeWallpaper ? null : existingBox.wallpaperUrl);

    const updatedBox = await prisma.questionBox.update({
      where: { id: boxId },
      data: {
        title: parsed.title,
        description: parsed.description || null,
        slug: parsed.slug,
        wallpaperUrl,
        acceptingQuestions: parsed.acceptingQuestions,
        status: parsed.status,
      },
    });

    if (
      existingBox.wallpaperUrl &&
      existingBox.wallpaperUrl !== updatedBox.wallpaperUrl
    ) {
      await removeImageByUrl(existingBox.wallpaperUrl);
    }

    return updatedBox;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(409, "Slug is already taken.", "SLUG_TAKEN");
    }

    if (uploadedWallpaperUrl) {
      await removeImageByUrl(uploadedWallpaperUrl);
    }

    throw error;
  }
}

export async function getBoxDetailForOwner(boxId: string, ownerId: string) {
  const box = await prisma.questionBox.findFirst({
    where: {
      id: boxId,
      ownerId,
    },
    include: {
      questions: {
        include: questionInclude,
        orderBy: {
          submittedAt: "desc",
        },
      },
    },
  });

  if (!box) {
    throw new AppError(404, "Question box not found.", "BOX_NOT_FOUND");
  }

  return {
    ...box,
    questions: box.questions.map(withoutDeletedAnswer),
  };
}

export async function getBoxSummaryForOwner(boxId: string, ownerId: string) {
  const box = await prisma.questionBox.findFirst({
    where: {
      id: boxId,
      ownerId,
    },
    include: {
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });

  if (!box) {
    throw new AppError(404, "Question box not found.", "BOX_NOT_FOUND");
  }

  return box;
}

export async function listQuestionsForOwnerBox(boxId: string, ownerId: string) {
  await getOwnedBoxOrThrow(boxId, ownerId);

  const questions = await prisma.question.findMany({
    where: {
      boxId,
    },
    include: questionInclude,
    orderBy: {
      submittedAt: "desc",
    },
  });

  return questions.map(withoutDeletedAnswer);
}

export async function saveAnswerForQuestion(
  boxId: string,
  questionId: string,
  ownerId: string,
  payload: {
    content: string;
    image?: File | null;
  },
) {
  await getOwnedBoxOrThrow(boxId, ownerId);

  const question = await prisma.question.findFirst({
    where: {
      id: questionId,
      boxId,
    },
    include: {
      answer: true,
    },
  });

  if (!question || question.status === QuestionStatus.DELETED) {
    throw new AppError(404, "Question not found.", "QUESTION_NOT_FOUND");
  }

  if (question.status === QuestionStatus.REJECTED) {
    throw new AppError(400, "Rejected questions cannot be answered.", "QUESTION_REJECTED");
  }

  const content = answerTextSchema.parse(payload.content);
  const fallbackImageUrl = question.answer?.deletedAt
    ? null
    : question.answer?.imageUrl ?? null;
  let uploadedImageUrl: string | null = null;

  try {
    uploadedImageUrl = payload.image
      ? await uploadImage(payload.image, `answers/${boxId}`)
      : null;

    const imageUrl = uploadedImageUrl ?? fallbackImageUrl;

    const answer = await prisma.$transaction(async (tx) => {
      const savedAnswer = await tx.answer.upsert({
        where: {
          questionId,
        },
        update: {
          content,
          imageUrl,
          deletedAt: null,
        },
        create: {
          questionId,
          content,
          imageUrl,
          deletedAt: null,
        },
      });

      await tx.question.update({
        where: { id: questionId },
        data: {
          status:
            question.status === QuestionStatus.PUBLISHED
              ? QuestionStatus.PUBLISHED
              : QuestionStatus.ANSWERED,
        },
      });

      return savedAnswer;
    });

    return answer;
  } catch (error) {
    if (uploadedImageUrl) {
      await removeImageByUrl(uploadedImageUrl);
    }

    throw error;
  }
}

export async function publishQuestionForOwner(
  boxId: string,
  questionId: string,
  ownerId: string,
) {
  await getOwnedBoxOrThrow(boxId, ownerId);

  const question = await prisma.question.findFirst({
    where: {
      id: questionId,
      boxId,
    },
    include: {
      answer: true,
    },
  });

  if (!question || question.status === QuestionStatus.DELETED) {
    throw new AppError(404, "Question not found.", "QUESTION_NOT_FOUND");
  }

  if (!question.answer || question.answer.deletedAt) {
    throw new AppError(400, "Add an answer before publishing.", "ANSWER_REQUIRED");
  }

  if (question.status === QuestionStatus.REJECTED) {
    throw new AppError(400, "Rejected questions cannot be published.", "QUESTION_REJECTED");
  }

  return prisma.question.update({
    where: {
      id: questionId,
    },
    data: {
      status: QuestionStatus.PUBLISHED,
      publishedAt: question.publishedAt ?? new Date(),
    },
  });
}

export async function updateQuestionStatusForOwner(
  boxId: string,
  questionId: string,
  ownerId: string,
  status: "REJECTED" | "DELETED",
) {
  await getOwnedBoxOrThrow(boxId, ownerId);

  const question = await prisma.question.findFirst({
    where: {
      id: questionId,
      boxId,
    },
  });

  if (!question) {
    throw new AppError(404, "Question not found.", "QUESTION_NOT_FOUND");
  }

  return prisma.question.update({
    where: {
      id: questionId,
    },
    data: {
      status,
      deletedAt: status === QuestionStatus.DELETED ? new Date() : null,
    },
  });
}

export async function getPublicBoxBySlug(slug: string) {
  const normalizedSlug = normalizeSlug(slug);

  const box = await prisma.questionBox.findUnique({
    where: {
      slug: normalizedSlug,
    },
    include: {
      questions: {
        where: {
          status: QuestionStatus.PUBLISHED,
        },
        include: questionInclude,
        orderBy: {
          publishedAt: "desc",
        },
      },
      owner: {
        select: {
          phone: true,
        },
      },
    },
  });

  if (!box || box.status !== QuestionBoxStatus.ACTIVE) {
    throw new AppError(404, "Public question box not found.", "BOX_NOT_FOUND");
  }

  return {
    ...box,
    questions: box.questions.map(withoutDeletedAnswer),
  };
}

export async function submitPublicQuestion(input: {
  slug: string;
  content: string;
  image?: File | null;
  ipAddress: string;
  userAgent: string;
}) {
  const box = await prisma.questionBox.findUnique({
    where: {
      slug: normalizeSlug(input.slug),
    },
  });

  if (!box || box.status !== QuestionBoxStatus.ACTIVE) {
    throw new AppError(404, "Question box not found.", "BOX_NOT_FOUND");
  }

  if (!box.acceptingQuestions) {
    throw new AppError(400, "This box is not accepting new questions.", "BOX_CLOSED");
  }

  const submitterIpHash = hashSubmitterIp(input.ipAddress || "unknown");
  const windowStart = addMinutes(new Date(), -RATE_LIMIT_WINDOW_MINUTES);

  const content = questionTextSchema.parse(input.content);
  let uploadedImageUrl: string | null = null;

  try {
    uploadedImageUrl = input.image
      ? await uploadImage(input.image, `questions/${box.id}`)
      : null;

    return await runSerializableTransaction(async (tx) => {
      const recentSubmissions = await tx.question.count({
        where: {
          boxId: box.id,
          submitterIpHash,
          submittedAt: {
            gte: windowStart,
          },
        },
      });

      if (recentSubmissions >= RATE_LIMIT_SUBMISSIONS_PER_WINDOW) {
        throw new AppError(
          429,
          "Too many submissions from this address. Please try again later.",
          "RATE_LIMITED",
        );
      }

      return tx.question.create({
        data: {
          boxId: box.id,
          content,
          imageUrl: uploadedImageUrl,
          submitterIpHash,
          submitterIp: input.ipAddress || null,
          submitterUserAgent: input.userAgent || null,
        },
      });
    });
  } catch (error) {
    if (uploadedImageUrl) {
      await removeImageByUrl(uploadedImageUrl);
    }

    throw error;
  }
}

export function isBoxVisibleToViewer(
  boxStatus: QuestionBoxStatus,
  role: UserRole,
  ownerId: string,
  viewerId: string,
) {
  if (role === UserRole.ADMIN) {
    return true;
  }

  return boxStatus !== QuestionBoxStatus.DISABLED && ownerId === viewerId;
}
