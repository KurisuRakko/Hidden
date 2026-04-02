# Hidden Technical Architecture

## 1. Technical Direction

The project should use a React-based full-stack web architecture with Docker-first local development.

Preferred implementation:

- React framework: Next.js
- Language: TypeScript
- UI library: MUI with a custom Material Design 2 theme
- ORM: Prisma
- Database: PostgreSQL
- File storage: MinIO
- Authentication: Phone number + password + session cookie

This path keeps the codebase compact while allowing both frontend pages and backend APIs to live in the same repository.

## 2. Why React and Next.js

- React matches the requested frontend direction.
- Next.js keeps routing, page rendering, API endpoints, and auth in one codebase.
- It is easier to containerize than a split frontend and backend for an MVP.
- The app can support public pages, dashboards, and admin interfaces without adding a second service layer too early.

## 3. High-Level Modules

### 3.1 Frontend

- Public marketing page
- Public question box page
- Login and registration pages
- User dashboard
- Question box management pages
- Admin dashboard

### 3.2 Backend

- Authentication endpoints
- Question box management endpoints
- Anonymous submission endpoints
- Admin management endpoints
- Upload handling endpoints

### 3.3 Infrastructure

- PostgreSQL for relational data
- MinIO for uploaded images
- Docker Compose for local orchestration

## 4. Domain Model

### User

- `id`
- `phone`
- `passwordHash`
- `role`
- `status`
- `phoneVerifiedAt`
- `createdAt`
- `updatedAt`

### InviteCode

- `id`
- `code`
- `maxUses`
- `usedCount`
- `status`
- `expiresAt`
- `createdBy`
- `createdAt`

### QuestionBox

- `id`
- `ownerId`
- `title`
- `slug`
- `description`
- `status`
- `acceptingQuestions`
- `createdAt`
- `updatedAt`

### Question

- `id`
- `boxId`
- `content`
- `imageUrl`
- `status`
- `submitterIpHash`
- `submittedAt`
- `publishedAt`
- `deletedAt`

### Answer

- `id`
- `questionId`
- `content`
- `imageUrl`
- `createdAt`
- `updatedAt`

### AdminActionLog

- `id`
- `adminId`
- `targetType`
- `targetId`
- `action`
- `reason`
- `createdAt`

## 5. Role and Access Control

- `VISITOR`
  - Can view public question boxes
  - Can submit anonymous questions
- `USER`
  - Can manage only their own boxes and related questions
- `ADMIN`
  - Can view and operate on all resources

Route and API protection should be centralized to avoid scattering permission checks across unrelated code.

## 6. Application States

### User Status

- `ACTIVE`
- `DISABLED`
- `BANNED`

### Box Status

- `ACTIVE`
- `HIDDEN`
- `DISABLED`

### Question Status

- `PENDING`
- `ANSWERED`
- `PUBLISHED`
- `REJECTED`
- `DELETED`

## 7. Main API Surface

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`
- `GET /api/boxes`
- `POST /api/boxes`
- `PATCH /api/boxes/:id`
- `GET /api/boxes/:id/questions`
- `POST /api/boxes/:id/questions/:questionId/answer`
- `POST /api/boxes/:id/questions/:questionId/publish`
- `GET /api/public/boxes/:slug`
- `POST /api/public/boxes/:slug/questions`
- `GET /api/admin/users`
- `GET /api/admin/boxes`
- `GET /api/admin/questions`
- `GET /api/admin/invites`
- `POST /api/admin/invites`
- `PATCH /api/admin/invites/:id`
- `DELETE /api/admin/questions/:id`
- `PATCH /api/admin/users/:id/status`

## 8. Suggested Repository Layout

The implementation should aim for a layout similar to this:

```text
src/
  app/
    (public)/
    (auth)/
    dashboard/
    admin/
    api/
  components/
    ui/
    layout/
    boxes/
    questions/
    admin/
  lib/
    auth/
    db/
    storage/
    validation/
    permissions/
  features/
    auth/
    boxes/
    questions/
    admin/
prisma/
docker/
docs/
```

The codebase should keep business logic in feature and lib modules so page files stay thin.

## 9. Docker Plan

The MVP should include a `docker-compose.yml` with these services:

- `web`: Next.js application
- `db`: PostgreSQL
- `storage`: MinIO

Expected local developer flow:

1. Copy environment variables from an example file.
2. Run `docker compose up --build`.
3. Apply database migrations.
4. Open the web app in the browser.

## 10. Non-Functional Requirements

- The UI should be responsive for mobile and desktop.
- The architecture should support soft deletion and admin audit trails.
- File upload validation should happen on both client and server boundaries.
- A single source of truth should exist for validation schemas and role checks.
- Individual files should stay under 1000 lines by splitting feature modules early.

## 11. Implementation Priorities

1. Bootstrap the React and Docker project.
2. Set up database, Prisma schema, and auth foundations.
3. Implement registration, login, and invite code checks.
4. Implement user dashboard and multi-box management.
5. Implement anonymous submission and moderation flow.
6. Implement admin console and global controls.
7. Add image upload and basic anti-abuse protections.
