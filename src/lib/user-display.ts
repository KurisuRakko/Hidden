type UserIdentityLike = {
  subject: string;
};

type UserDisplayInput = {
  phone?: string | null;
  externalPhone?: string | null;
  email?: string | null;
  identities?: UserIdentityLike[] | null;
};

export function maskUserIdentitySubject(subject: string) {
  const normalized = subject.trim();

  if (!normalized) {
    return "OIDC account";
  }

  if (normalized.length <= 10) {
    return `OIDC ${normalized}`;
  }

  return `OIDC ${normalized.slice(0, 4)}...${normalized.slice(-4)}`;
}

export function getPrimaryUserContactValue(user: UserDisplayInput) {
  return user.phone ?? user.externalPhone ?? user.email ?? null;
}

export function getUserDisplayLabel(user: UserDisplayInput) {
  const primaryValue = getPrimaryUserContactValue(user);

  if (primaryValue) {
    return primaryValue;
  }

  const subject = user.identities?.[0]?.subject;
  return subject ? maskUserIdentitySubject(subject) : "Unknown account";
}
