import assert from "node:assert/strict";
import test from "node:test";
import { AuthProvider } from "@prisma/client";
import {
  signInWithOidcClaims,
  type OidcAccountStore,
} from "@/features/auth/oidc-service";

type StoredUser = {
  id: string;
  phone: string | null;
  email: string | null;
  externalPhone: string | null;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "DISABLED" | "BANNED";
  createdAt: Date;
  passwordHash: string | null;
};

type StoredIdentity = {
  id: string;
  provider: AuthProvider;
  issuer: string;
  subject: string;
  organization: string | null;
  userId: string;
};

function createInMemoryOidcStore(seed?: {
  users?: StoredUser[];
  identities?: StoredIdentity[];
}): OidcAccountStore & { users: StoredUser[]; identities: StoredIdentity[] } {
  const users = [...(seed?.users ?? [])];
  const identities = [...(seed?.identities ?? [])];

  function getUserRecord(userId: string) {
    const user = users.find((entry) => entry.id === userId);

    if (!user) {
      throw new Error(`Missing user ${userId}`);
    }

    return {
      ...user,
      identities: identities
        .filter((entry) => entry.userId === userId)
        .map((entry) => ({ subject: entry.subject })),
    };
  }

  return {
    users,
    identities,
    async findIdentityByKey(key) {
      const identity = identities.find(
        (entry) =>
          entry.provider === key.provider &&
          entry.issuer === key.issuer &&
          entry.subject === key.subject,
      );

      if (!identity) {
        return null;
      }

      return {
        id: identity.id,
        organization: identity.organization,
        user: getUserRecord(identity.userId),
      };
    },
    async updateIdentityAccount(existing, profile) {
      const identity = identities.find((entry) => entry.id === existing.id);

      if (!identity) {
        throw new Error(`Missing identity ${existing.id}`);
      }

      identity.organization = profile.organization ?? identity.organization;

      const user = users.find((entry) => entry.id === existing.user.id);

      if (!user) {
        throw new Error(`Missing user ${existing.user.id}`);
      }

      if (profile.email) {
        user.email = profile.email;
      }

      if (profile.externalPhone) {
        user.externalPhone = profile.externalPhone;
      }

      return getUserRecord(user.id);
    },
    async createIdentityAccount(profile) {
      const userId = `user-${users.length + 1}`;
      const identityId = `identity-${identities.length + 1}`;

      users.push({
        id: userId,
        phone: null,
        email: profile.email,
        externalPhone: profile.externalPhone,
        role: "USER",
        status: "ACTIVE",
        createdAt: new Date("2026-04-12T00:00:00.000Z"),
        passwordHash: null,
      });
      identities.push({
        id: identityId,
        provider: profile.provider,
        issuer: profile.issuer,
        subject: profile.subject,
        organization: profile.organization,
        userId,
      });

      return getUserRecord(userId);
    },
  };
}

function createSessionForTests(userId: string) {
  return Promise.resolve({
    token: `session-${userId}`,
    expiresAt: new Date("2030-01-01T00:00:00.000Z"),
  });
}

test("OIDC sign-in provisions a new user when only email is present", async () => {
  const store = createInMemoryOidcStore();
  const result = await signInWithOidcClaims(
    {
      issuer: "https://casdoor.example.com",
      claims: {
        sub: "casdoor-email-only",
        email: "User@Example.com",
      },
    },
    {
      store,
      createSession: createSessionForTests,
    },
  );

  assert.equal(result.user.email, "user@example.com");
  assert.equal(result.user.externalPhone, null);
  assert.equal(result.user.displayLabel, "user@example.com");
  assert.equal(result.user.hasPassword, false);
  assert.equal(result.user.hasOidcIdentity, true);
});

test("OIDC sign-in provisions a new user when only phone is present", async () => {
  const store = createInMemoryOidcStore();
  const result = await signInWithOidcClaims(
    {
      issuer: "https://casdoor.example.com",
      claims: {
        sub: "casdoor-phone-only",
        phone_number: "+1 555 010 9999",
      },
    },
    {
      store,
      createSession: createSessionForTests,
    },
  );

  assert.equal(result.user.email, null);
  assert.equal(result.user.externalPhone, "+15550109999");
  assert.equal(result.user.displayLabel, "+15550109999");
});

test("OIDC sign-in falls back to a masked identity when no email or phone is present", async () => {
  const store = createInMemoryOidcStore();
  const result = await signInWithOidcClaims(
    {
      issuer: "https://casdoor.example.com",
      claims: {
        sub: "casdoor-no-contact-12345",
      },
    },
    {
      store,
      createSession: createSessionForTests,
    },
  );

  assert.equal(result.user.email, null);
  assert.equal(result.user.externalPhone, null);
  assert.match(result.user.displayLabel, /^OIDC /);
});

test("OIDC sign-in reuses the same linked account on repeat login", async () => {
  const store = createInMemoryOidcStore();
  const firstLogin = await signInWithOidcClaims(
    {
      issuer: "https://casdoor.example.com",
      claims: {
        sub: "casdoor-repeat-user",
        email: "first@example.com",
      },
    },
    {
      store,
      createSession: createSessionForTests,
    },
  );
  const secondLogin = await signInWithOidcClaims(
    {
      issuer: "https://casdoor.example.com",
      claims: {
        sub: "casdoor-repeat-user",
        email: "updated@example.com",
        phone: "+86 138 0000 0000",
      },
    },
    {
      store,
      createSession: createSessionForTests,
    },
  );

  assert.equal(secondLogin.user.id, firstLogin.user.id);
  assert.equal(secondLogin.user.email, "updated@example.com");
  assert.equal(secondLogin.user.externalPhone, "+8613800000000");
  assert.equal(store.users.length, 1);
});

test("OIDC sign-in does not auto-link to an existing local account with the same contact data", async () => {
  const store = createInMemoryOidcStore({
    users: [
      {
        id: "local-user-1",
        phone: "+15550000000",
        email: "existing@example.com",
        externalPhone: null,
        role: "USER",
        status: "ACTIVE",
        createdAt: new Date("2026-04-11T00:00:00.000Z"),
        passwordHash: "local-password-hash",
      },
    ],
  });
  const result = await signInWithOidcClaims(
    {
      issuer: "https://casdoor.example.com",
      claims: {
        sub: "casdoor-new-user",
        email: "existing@example.com",
        phone_number: "+1 555 000 0000",
      },
    },
    {
      store,
      createSession: createSessionForTests,
    },
  );

  assert.notEqual(result.user.id, "local-user-1");
  assert.equal(store.users.length, 2);
  assert.equal(store.identities.length, 1);
});
