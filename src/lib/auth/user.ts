import { Prisma } from "@prisma/client";
import { getUserDisplayLabel } from "@/lib/user-display";

export const USER_DISPLAY_SELECT = {
  phone: true,
  email: true,
  externalPhone: true,
  identities: {
    select: {
      subject: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 1,
  },
} as const satisfies Prisma.UserSelect;

export const SESSION_USER_SELECT = {
  id: true,
  role: true,
  status: true,
  createdAt: true,
  passwordHash: true,
  ...USER_DISPLAY_SELECT,
} as const satisfies Prisma.UserSelect;

type SerializableUserRecord = {
  id: string;
  phone: string | null;
  email: string | null;
  externalPhone: string | null;
  role: string;
  status: string;
  createdAt: Date;
  passwordHash?: string | null;
  identities?: Array<{ subject: string }>;
};

export type ClientUser = {
  id: string;
  phone: string | null;
  email: string | null;
  externalPhone: string | null;
  role: string;
  status: string;
  createdAt: Date;
  displayLabel: string;
  hasPassword: boolean;
  hasOidcIdentity: boolean;
};

export function serializeUserForClient(user: SerializableUserRecord): ClientUser {
  return {
    id: user.id,
    phone: user.phone ?? null,
    email: user.email ?? null,
    externalPhone: user.externalPhone ?? null,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    displayLabel: getUserDisplayLabel(user),
    hasPassword: Boolean(user.passwordHash),
    hasOidcIdentity: Boolean(user.identities?.length),
  };
}
