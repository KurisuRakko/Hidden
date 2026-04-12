import {
  AuthProvider,
  Prisma,
  UserRole,
} from "@prisma/client";
import { createSession } from "@/lib/auth/session";
import {
  SESSION_USER_SELECT,
  serializeUserForClient,
} from "@/lib/auth/user";
import { prisma, runSerializableTransaction } from "@/lib/db";
import { AppError } from "@/lib/http";
import { normalizePhone } from "@/lib/validation/common";

type SessionUserRecord = Prisma.UserGetPayload<{
  select: typeof SESSION_USER_SELECT;
}>;

type IdentityLookup = {
  id: string;
  organization: string | null;
  user: SessionUserRecord;
};

type IdentityKey = {
  provider: AuthProvider;
  issuer: string;
  subject: string;
};

export type NormalizedOidcClaims = {
  provider: AuthProvider;
  issuer: string;
  subject: string;
  email: string | null;
  externalPhone: string | null;
  displayName: string | null;
  organization: string | null;
};

export type OidcAccountStore = {
  findIdentityByKey: (key: IdentityKey) => Promise<IdentityLookup | null>;
  updateIdentityAccount: (
    existing: IdentityLookup,
    profile: NormalizedOidcClaims,
  ) => Promise<SessionUserRecord>;
  createIdentityAccount: (
    profile: NormalizedOidcClaims,
  ) => Promise<SessionUserRecord>;
};

type SignInWithOidcDependencies = {
  store?: OidcAccountStore;
  createSession?: typeof createSession;
};

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized ? normalized : null;
}

function normalizeEmail(value: unknown) {
  const email = normalizeOptionalString(value);
  return email ? email.toLowerCase() : null;
}

function normalizeExternalPhone(value: unknown) {
  const phone = normalizeOptionalString(value);
  return phone ? normalizePhone(phone) : null;
}

function getOrganizationClaim(claims: Record<string, unknown>) {
  return (
    normalizeOptionalString(claims.Organization) ??
    normalizeOptionalString(claims.organization) ??
    normalizeOptionalString(claims.org_name) ??
    null
  );
}

export function normalizeOidcClaims(input: {
  issuer: string;
  claims: Record<string, unknown>;
}) {
  const subject = normalizeOptionalString(input.claims.sub);

  if (!subject) {
    throw new AppError(
      502,
      "OIDC profile did not include a subject identifier.",
      "OIDC_PROFILE_INVALID",
    );
  }

  return {
    provider: AuthProvider.CASDOOR,
    issuer: input.issuer,
    subject,
    email: normalizeEmail(input.claims.email),
    externalPhone:
      normalizeExternalPhone(input.claims.phone_number) ??
      normalizeExternalPhone(input.claims.phone),
    displayName:
      normalizeOptionalString(input.claims.name) ??
      normalizeOptionalString(input.claims.preferred_username),
    organization: getOrganizationClaim(input.claims),
  } satisfies NormalizedOidcClaims;
}

export async function reconcileOidcAccount(
  profile: NormalizedOidcClaims,
  store: OidcAccountStore,
) {
  const existing = await store.findIdentityByKey({
    provider: profile.provider,
    issuer: profile.issuer,
    subject: profile.subject,
  });

  if (existing) {
    return store.updateIdentityAccount(existing, profile);
  }

  return store.createIdentityAccount(profile);
}

const prismaOidcAccountStore: OidcAccountStore = {
  async findIdentityByKey(key) {
    return prisma.userIdentity.findUnique({
      where: {
        provider_issuer_subject: key,
      },
      select: {
        id: true,
        organization: true,
        user: {
          select: SESSION_USER_SELECT,
        },
      },
    });
  },

  async updateIdentityAccount(existing, profile) {
    const nextOrganization = profile.organization ?? existing.organization;
    const nextUserData: Prisma.UserUpdateInput = {
      ...(profile.email ? { email: profile.email } : {}),
      ...(profile.externalPhone ? { externalPhone: profile.externalPhone } : {}),
    };

    if (
      nextOrganization === existing.organization &&
      Object.keys(nextUserData).length === 0
    ) {
      return existing.user;
    }

    return runSerializableTransaction(async (tx) => {
      if (nextOrganization !== existing.organization) {
        await tx.userIdentity.update({
          where: {
            id: existing.id,
          },
          data: {
            organization: nextOrganization,
          },
        });
      }

      if (Object.keys(nextUserData).length > 0) {
        return tx.user.update({
          where: {
            id: existing.user.id,
          },
          data: nextUserData,
          select: SESSION_USER_SELECT,
        });
      }

      return tx.user.findUniqueOrThrow({
        where: {
          id: existing.user.id,
        },
        select: SESSION_USER_SELECT,
      });
    });
  },

  async createIdentityAccount(profile) {
    try {
      return await runSerializableTransaction(async (tx) => {
        const createdUser = await tx.user.create({
          data: {
            role: UserRole.USER,
            email: profile.email,
            externalPhone: profile.externalPhone,
          },
          select: {
            id: true,
          },
        });

        await tx.userIdentity.create({
          data: {
            provider: profile.provider,
            issuer: profile.issuer,
            subject: profile.subject,
            organization: profile.organization,
            userId: createdUser.id,
          },
        });

        return tx.user.findUniqueOrThrow({
          where: {
            id: createdUser.id,
          },
          select: SESSION_USER_SELECT,
        });
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const existing = await prisma.userIdentity.findUnique({
          where: {
            provider_issuer_subject: {
              provider: profile.provider,
              issuer: profile.issuer,
              subject: profile.subject,
            },
          },
          select: {
            user: {
              select: SESSION_USER_SELECT,
            },
          },
        });

        if (existing) {
          return existing.user;
        }
      }

      throw error;
    }
  },
};

export async function signInWithOidcClaims(
  input: {
    issuer: string;
    claims: Record<string, unknown>;
  },
  dependencies: SignInWithOidcDependencies = {},
) {
  const profile = normalizeOidcClaims(input);
  const user = await reconcileOidcAccount(
    profile,
    dependencies.store ?? prismaOidcAccountStore,
  );

  if (user.status !== "ACTIVE") {
    throw new AppError(
      403,
      "This account is disabled. Please contact an administrator.",
      "USER_DISABLED",
    );
  }

  const session = await (dependencies.createSession ?? createSession)(user.id);

  return {
    profile,
    user: serializeUserForClient(user),
    session,
  };
}
