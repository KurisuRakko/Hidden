import bcrypt from "bcryptjs";
import { InviteCodeStatus, UserRole } from "@prisma/client";
import { prisma } from "../src/lib/db";
import { getEnv } from "../src/lib/env";
import {
  normalizeInviteCode,
  normalizePhone,
} from "../src/lib/validation/common";

async function main() {
  const env = getEnv();
  const adminPhone = normalizePhone(env.SEED_ADMIN_PHONE);
  const inviteCode = normalizeInviteCode(env.SEED_DEFAULT_INVITE);

  const passwordHash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { phone: adminPhone },
    update: {
      passwordHash,
      role: UserRole.ADMIN,
      status: "ACTIVE",
    },
    create: {
      phone: adminPhone,
      passwordHash,
      role: UserRole.ADMIN,
      status: "ACTIVE",
    },
  });

  await prisma.inviteCode.upsert({
    where: { code: inviteCode },
    update: {
      status: InviteCodeStatus.ACTIVE,
      maxUses: 100,
      createdById: admin.id,
    },
    create: {
      code: inviteCode,
      status: InviteCodeStatus.ACTIVE,
      maxUses: 100,
      createdById: admin.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
