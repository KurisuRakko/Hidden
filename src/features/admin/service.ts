import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import {
  AdminTargetType,
  InviteCodeStatus,
  Prisma,
  QuestionBoxStatus,
  QuestionStatus,
  UserRole,
  UserStatus,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth/session";
import { AppError } from "@/lib/http";
import { inviteFormSchema, normalizeInviteCode } from "@/lib/validation/common";

async function logAdminAction(input: {
  adminId: string;
  targetType: AdminTargetType;
  targetId: string;
  action: string;
  reason?: string | null;
  metadata?: Prisma.InputJsonValue;
}) {
  return prisma.adminActionLog.create({
    data: input,
  });
}

export async function getAdminOverview() {
  const [userCount, boxCount, questionCount, inviteCount, recentActions] =
    await Promise.all([
      prisma.user.count(),
      prisma.questionBox.count(),
      prisma.question.count(),
      prisma.inviteCode.count(),
      prisma.adminActionLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          admin: {
            select: {
              phone: true,
            },
          },
        },
      }),
    ]);

  return { userCount, boxCount, questionCount, inviteCount, recentActions };
}

export async function listAdminUsers(options: {
  q?: string;
  status?: UserStatus | "ALL";
  page: number;
  pageSize: number;
}) {
  const where: Prisma.UserWhereInput = {
    ...(options.q
      ? {
          phone: {
            contains: options.q,
          },
        }
      : {}),
    ...(options.status && options.status !== "ALL"
      ? {
          status: options.status,
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (options.page - 1) * options.pageSize,
      take: options.pageSize,
      include: {
        _count: {
          select: {
            boxes: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
}

export async function listAdminBoxes(options: {
  q?: string;
  status?: QuestionBoxStatus | "ALL";
  page: number;
  pageSize: number;
}) {
  const where: Prisma.QuestionBoxWhereInput = {
    ...(options.q
      ? {
          OR: [
            { title: { contains: options.q, mode: "insensitive" } },
            { slug: { contains: options.q, mode: "insensitive" } },
            { owner: { phone: { contains: options.q } } },
          ],
        }
      : {}),
    ...(options.status && options.status !== "ALL"
      ? {
          status: options.status,
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.questionBox.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (options.page - 1) * options.pageSize,
      take: options.pageSize,
      include: {
        owner: {
          select: {
            phone: true,
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
      },
    }),
    prisma.questionBox.count({ where }),
  ]);

  return { items, total };
}

export async function updateManagedBoxStatus(
  adminId: string,
  boxId: string,
  status: QuestionBoxStatus,
) {
  const box = await prisma.questionBox.update({
    where: { id: boxId },
    data: { status },
  });

  await logAdminAction({
    adminId,
    targetType: AdminTargetType.QUESTION_BOX,
    targetId: box.id,
    action: "box.status.update",
    metadata: {
      status,
    },
  });

  return box;
}

export async function listAdminQuestions(options: {
  q?: string;
  status?: QuestionStatus | "ALL";
  page: number;
  pageSize: number;
}) {
  const where: Prisma.QuestionWhereInput = {
    ...(options.q
      ? {
          OR: [
            { content: { contains: options.q, mode: "insensitive" } },
            { box: { slug: { contains: options.q, mode: "insensitive" } } },
            { box: { owner: { phone: { contains: options.q } } } },
          ],
        }
      : {}),
    ...(options.status && options.status !== "ALL"
      ? {
          status: options.status,
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.question.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      skip: (options.page - 1) * options.pageSize,
      take: options.pageSize,
      include: {
        answer: true,
        box: {
          include: {
            owner: {
              select: {
                phone: true,
              },
            },
          },
        },
      },
    }),
    prisma.question.count({ where }),
  ]);

  return { items, total };
}

export async function listAdminLogs(options: {
  q?: string;
  targetType?: AdminTargetType | "ALL";
  page: number;
  pageSize: number;
}) {
  const where: Prisma.AdminActionLogWhereInput = {
    ...(options.q
      ? {
          OR: [
            { targetId: { contains: options.q, mode: "insensitive" } },
            { action: { contains: options.q, mode: "insensitive" } },
            { admin: { phone: { contains: options.q } } },
          ],
        }
      : {}),
    ...(options.targetType && options.targetType !== "ALL"
      ? {
          targetType: options.targetType,
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.adminActionLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (options.page - 1) * options.pageSize,
      take: options.pageSize,
      include: {
        admin: {
          select: {
            phone: true,
          },
        },
      },
    }),
    prisma.adminActionLog.count({ where }),
  ]);

  return { items, total };
}

export async function listAdminInvites(options: {
  q?: string;
  status?: InviteCodeStatus | "ALL";
  page: number;
  pageSize: number;
}) {
  const where: Prisma.InviteCodeWhereInput = {
    ...(options.q
      ? {
          code: {
            contains: options.q.toUpperCase(),
          },
        }
      : {}),
    ...(options.status && options.status !== "ALL"
      ? {
          status: options.status,
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.inviteCode.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (options.page - 1) * options.pageSize,
      take: options.pageSize,
      include: {
        createdBy: {
          select: {
            phone: true,
          },
        },
      },
    }),
    prisma.inviteCode.count({ where }),
  ]);

  return { items, total };
}

export async function createInviteCode(
  adminId: string,
  input: {
    code: string;
    maxUses?: number | null;
    expiresAt?: string | null;
    status?: InviteCodeStatus;
  },
) {
  const parsed = inviteFormSchema.parse({
    code: input.code,
    maxUses: input.maxUses ?? null,
    expiresAt: input.expiresAt ?? null,
    status: input.status ?? InviteCodeStatus.ACTIVE,
  });

  try {
    const invite = await prisma.inviteCode.create({
      data: {
        code: parsed.code,
        maxUses: parsed.maxUses ?? null,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
        status: parsed.status,
        createdById: adminId,
      },
    });

    await logAdminAction({
      adminId,
      targetType: AdminTargetType.INVITE_CODE,
      targetId: invite.id,
      action: "invite.create",
      metadata: {
        code: invite.code,
      },
    });

    return invite;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(409, "Invite code already exists.", "INVITE_DUPLICATED");
    }

    throw error;
  }
}

export async function updateInviteCode(
  adminId: string,
  inviteId: string,
  input: {
    code: string;
    maxUses?: number | null;
    expiresAt?: string | null;
    status?: InviteCodeStatus;
  },
) {
  const parsed = inviteFormSchema.parse({
    code: input.code,
    maxUses: input.maxUses ?? null,
    expiresAt: input.expiresAt ?? null,
    status: input.status ?? InviteCodeStatus.ACTIVE,
  });

  try {
    const invite = await prisma.inviteCode.update({
      where: { id: inviteId },
      data: {
        code: normalizeInviteCode(parsed.code),
        maxUses: parsed.maxUses ?? null,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
        status: parsed.status,
      },
    });

    await logAdminAction({
      adminId,
      targetType: AdminTargetType.INVITE_CODE,
      targetId: invite.id,
      action: "invite.update",
      metadata: {
        code: invite.code,
      },
    });

    return invite;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(409, "Invite code already exists.", "INVITE_DUPLICATED");
    }

    throw error;
  }
}

export async function updateManagedUserStatus(
  adminId: string,
  userId: string,
  status: UserStatus,
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });

  await logAdminAction({
    adminId,
    targetType: AdminTargetType.USER,
    targetId: user.id,
    action: "user.status.update",
    metadata: {
      status,
    },
  });

  return user;
}

export async function deleteQuestionAsAdmin(adminId: string, questionId: string) {
  const question = await prisma.question.update({
    where: { id: questionId },
    data: {
      status: QuestionStatus.DELETED,
      deletedAt: new Date(),
    },
  });

  await logAdminAction({
    adminId,
    targetType: AdminTargetType.QUESTION,
    targetId: question.id,
    action: "question.delete",
  });

  return question;
}

export async function deleteAnswerAsAdmin(adminId: string, answerId: string) {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    include: {
      question: true,
    },
  });

  if (!answer) {
    throw new AppError(404, "Answer not found.", "ANSWER_NOT_FOUND");
  }

  if (answer.deletedAt) {
    throw new AppError(400, "Answer has already been removed.", "ANSWER_REMOVED");
  }

  const result = await prisma.$transaction(async (tx) => {
    const removedAnswer = await tx.answer.update({
      where: { id: answerId },
      data: {
        deletedAt: new Date(),
      },
    });

    await tx.question.update({
      where: { id: answer.questionId },
      data: {
        status:
          answer.question.status === QuestionStatus.ANSWERED ||
          answer.question.status === QuestionStatus.PUBLISHED
            ? QuestionStatus.PENDING
            : answer.question.status,
        publishedAt: null,
      },
    });

    await tx.adminActionLog.create({
      data: {
        adminId,
        targetType: AdminTargetType.ANSWER,
        targetId: removedAnswer.id,
        action: "answer.delete",
        metadata: {
          questionId: answer.questionId,
          boxId: answer.question.boxId,
        },
      },
    });

    return removedAnswer;
  });

  return result;
}

export async function resetUserPassword(adminId: string, userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    throw new AppError(404, "User not found.", "USER_NOT_FOUND");
  }

  if (user.role === UserRole.ADMIN) {
    throw new AppError(403, "Cannot reset password for admin accounts.", "CANNOT_RESET_ADMIN");
  }

  const temporaryPassword = randomBytes(12).toString("base64url");
  const passwordHash = await bcrypt.hash(temporaryPassword, 12);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Invalidate all existing sessions for this user
    await tx.session.deleteMany({
      where: { userId },
    });
  });

  await logAdminAction({
    adminId,
    targetType: AdminTargetType.USER,
    targetId: userId,
    action: "user.password.reset",
  });

  return { temporaryPassword };
}

export async function impersonateUser(adminId: string, userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, status: true },
  });

  if (!user) {
    throw new AppError(404, "User not found.", "USER_NOT_FOUND");
  }

  if (user.role === UserRole.ADMIN) {
    throw new AppError(403, "Cannot impersonate admin accounts.", "CANNOT_IMPERSONATE_ADMIN");
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(400, "Cannot impersonate a disabled or banned user.", "USER_NOT_ACTIVE");
  }

  const session = await createSession(userId);

  await logAdminAction({
    adminId,
    targetType: AdminTargetType.USER,
    targetId: userId,
    action: "user.impersonate",
  });

  return session;
}
