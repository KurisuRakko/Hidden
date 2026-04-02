# Hidden

Hidden is an invite-only anonymous question box web application built with Next.js, TypeScript, MUI, Prisma, PostgreSQL, and MinIO.

## What Is Included

- Phone number + password + invite code registration
- Server-side session cookie authentication
- Multi-box management for each user
- Public anonymous submission pages at `/b/[slug]`
- Pending review, answer, publish, reject, and delete workflow
- Admin console for users, boxes, questions, and invite codes
- Docker Compose setup with `web`, `db`, and `storage`

## Stack

- Next.js App Router
- TypeScript
- MUI with an MD2-inspired custom theme
- Prisma ORM
- PostgreSQL
- MinIO object storage
- Docker Compose

## Local Startup

1. Copy the environment file.

```bash
cp .env.example .env
```

2. Start the full stack.

```bash
docker compose up --build
```

3. Open the app.

- Web app: [http://localhost:3000](http://localhost:3000)
- MinIO console: [http://localhost:9001](http://localhost:9001)
- Admin portal from the same computer: [http://localhost:3001/admin-login](http://localhost:3001/admin-login)
- Admin portal from another device on the same LAN: `http://<your-computer-lan-ip>:3001/admin-login`

To make the admin portal usable from other devices on the same LAN:

- keep `ADMIN_BIND_HOST=0.0.0.0` in `.env`
- set `ADMIN_APP_URL` to your computer's LAN address, for example `http://192.168.1.20:3001`
- restart the stack with `docker compose up --build`

On container startup, Hidden will automatically:

- apply Prisma migrations
- seed the default admin and invite code
- create the MinIO bucket and public read policy
- start the Next.js web server

## Default Admin

The seed script creates a default admin from `.env`.

- Phone: `SEED_ADMIN_PHONE`
- Password: `SEED_ADMIN_PASSWORD`
- Default invite code: `SEED_DEFAULT_INVITE`

The default sample values in `.env.example` are:

- Admin phone: `+10000000000`
- Admin password: `hiddenadmin123`
- Invite code: `HIDDEN-MVP`

## Useful Routes

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/dashboard/boxes`
- `/b/[slug]`
- `/admin`
- `/admin/users`
- `/admin/boxes`
- `/admin/questions`
- `/admin/invites`
- `/admin-login`

## Development Notes

- Product requirements live in [README.md](./README.md), [docs/product-spec.md](./docs/product-spec.md), and [docs/technical-architecture.md](./docs/technical-architecture.md).
- Uploaded images are stored in MinIO and exposed through the configured public bucket URL.
- The first version keeps moderation logic intentionally simple and server-side.
