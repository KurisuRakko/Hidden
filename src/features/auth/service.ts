import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { AuthPortal, getAdminAppUrl } from "@/lib/admin-portal";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/http";
import { createSession } from "@/lib/auth/session";
import {
  inviteCodeSchema,
  passwordSchema,
  phoneSchema,
} from "@/lib/validation/common";

export async function registerUser(input: {
  phone: string;
  password: string;
  inviteCode: string;
}) {
  const phone = phoneSchema.parse(input.phone);
  const password = passwordSchema.parse(input.password);
  const inviteCode = inviteCodeSchema.parse(input.inviteCode);

  const existingUser = await prisma.user.findUnique({
    where: { phone },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError(409, "This phone number is already registered.", "PHONE_TAKEN");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const invite = await tx.inviteCode.findUnique({
      where: { code: inviteCode },
    });

    if (!invite || invite.status !== "ACTIVE") {
      throw new AppError(400, "Invite code is invalid.", "INVITE_INVALID");
    }

    if (invite.expiresAt && invite.expiresAt <= new Date()) {
      throw new AppError(400, "Invite code has expired.", "INVITE_EXPIRED");
    }

    if (invite.maxUses !== null && invite.usedCount >= invite.maxUses) {
      throw new AppError(400, "Invite code has reached its usage limit.", "INVITE_EXHAUSTED");
    }

    const createdUser = await tx.user.create({
      data: {
        phone,
        passwordHash,
        role: UserRole.USER,
      },
    });

    await tx.inviteCode.update({
      where: { id: invite.id },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });

    return createdUser;
  });

  const session = await createSession(user.id);

  return {
    user,
    session,
  };
}

export async function loginUser(input: {
  phone: string;
  password: string;
  portal: AuthPortal;
}) {
  const phone = phoneSchema.parse(input.phone);
  const password = passwordSchema.parse(input.password);

  const user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user) {
    throw new AppError(401, "Phone number or password is incorrect.", "LOGIN_FAILED");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError(401, "Phone number or password is incorrect.", "LOGIN_FAILED");
  }

  if (input.portal === "PUBLIC" && user.role === UserRole.ADMIN) {
    throw new AppError(
      403,
      "Administrator accounts must sign in through the internal admin portal.",
      "ADMIN_PORTAL_REQUIRED",
      {
        adminLoginUrl: getAdminAppUrl("/admin-login"),
      },
    );
  }

  if (input.portal === "ADMIN" && user.role !== UserRole.ADMIN) {
    throw new AppError(
      403,
      "This login is reserved for administrator accounts.",
      "ADMIN_ONLY_PORTAL",
    );
  }

  if (user.status !== "ACTIVE") {
    throw new AppError(
      403,
      "This account is disabled. Please contact an administrator.",
      "USER_DISABLED",
    );
  }

  const session = await createSession(user.id);

  return {
    user,
    session,
  };
}
