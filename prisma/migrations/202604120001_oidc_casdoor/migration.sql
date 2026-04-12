-- Add support for OIDC-based accounts while keeping legacy phone/password auth intact.
CREATE TYPE "AuthProvider" AS ENUM ('CASDOOR');

ALTER TABLE "User"
  ALTER COLUMN "phone" DROP NOT NULL,
  ALTER COLUMN "passwordHash" DROP NOT NULL,
  ADD COLUMN "email" TEXT,
  ADD COLUMN "externalPhone" TEXT;

CREATE TABLE "UserIdentity" (
  "id" TEXT NOT NULL,
  "provider" "AuthProvider" NOT NULL,
  "issuer" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "organization" TEXT,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "UserIdentity_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserIdentity_provider_issuer_subject_key"
  ON "UserIdentity"("provider", "issuer", "subject");

CREATE INDEX "UserIdentity_userId_idx" ON "UserIdentity"("userId");

ALTER TABLE "UserIdentity"
  ADD CONSTRAINT "UserIdentity_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
