# Hidden Deployment Guide

This document describes the recommended production deployment flow for Hidden on a single Linux host with Docker Compose.

Hidden currently ships as four services:

- `proxy`: Nginx reverse proxy with separate public and admin listeners
- `web`: Next.js application
- `db`: PostgreSQL
- `storage`: MinIO

The existing container startup flow already does the following automatically:

- runs Prisma migrations
- seeds the default admin and invite code
- initializes the MinIO bucket and public read policy
- starts the Next.js server on `0.0.0.0:3000`

## 1. Prerequisites

- A Linux server with Docker and Docker Compose available
- A domain or subdomain for the web app
- A public URL for MinIO object access, or a reverse proxy route that exposes the bucket publicly
- Open ports for:
  - the public app listener
  - a private admin listener
  - internal access between `proxy`, `web`, `db`, and `storage`

Recommended minimum:

- 2 vCPU
- 4 GB RAM
- 20 GB+ disk

## 2. Clone the Project

```bash
git clone <your-repo-url> hidden
cd hidden
```

## 3. Create the Production Environment File

Copy the example file first:

```bash
cp .env.example .env
```

Then update `.env` for production.

Important variables:

```env
APP_URL=https://hidden.example.com
ADMIN_APP_URL=https://admin.hidden.internal
DATABASE_URL=postgresql://hidden:<strong-db-password>@db:5432/hidden?schema=public

SESSION_SECRET=<long-random-secret>
IP_HASH_SECRET=<long-random-secret>

POSTGRES_DB=hidden
POSTGRES_USER=hidden
POSTGRES_PASSWORD=<strong-db-password>

MINIO_ENDPOINT=storage
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=<strong-minio-access-key>
MINIO_SECRET_KEY=<strong-minio-secret-key>
MINIO_BUCKET=hidden-media
MINIO_PUBLIC_URL=https://media.example.com

SEED_ADMIN_PHONE=+10000000000
SEED_ADMIN_PASSWORD=<strong-admin-password>
SEED_DEFAULT_INVITE=HIDDEN-MVP
```

Notes:

- `APP_URL` should be the final public site URL.
- `ADMIN_APP_URL` should be the internal-only admin login URL, for example `https://admin.hidden.internal` or `http://127.0.0.1:3001`.
- `DATABASE_URL` should keep `db` as the hostname when using the included `docker-compose.yml`.
- `MINIO_PUBLIC_URL` must be the public base URL that browsers can actually access.
- Change every default secret before deployment.
- The seed script runs on container start, so use a safe admin password from the beginning.

## 4. Prepare Persistent Storage

The included Compose file already defines named volumes:

- `hidden-db`
- `hidden-storage`

These persist PostgreSQL and MinIO data across restarts.

To inspect them:

```bash
docker volume ls | grep hidden
```

## 5. Start the Stack

Build and start in the background:

```bash
docker compose up --build -d
```

Check service status:

```bash
docker compose ps
```

Watch logs during first boot:

```bash
docker compose logs -f proxy web
```

On the first startup, the `web` container will wait for PostgreSQL, apply migrations, seed default data, initialize MinIO, and then start the app.

## 6. Public and Admin Port Split

The included Compose stack now puts Nginx in front of the Next app:

- public site: host port `3000`
- admin portal: host port `3001`

By default, the admin port is bound to `127.0.0.1`, which keeps it off public interfaces on the same host. For production, either:

- keep the admin listener bound to loopback and reach it through SSH/VPN, or
- bind it to a private interface that is only reachable from your internal network

The proxy config lives at `docker/nginx/hidden.conf` and enforces:

- public listener blocks `/admin`, `/admin-login`, and `/api/admin`
- admin listener serves `/admin-login`, `/admin`, `/api/admin`, shared assets, and auth endpoints
- admin listener injects the `x-hidden-admin-portal: 1` header required by the app

If you place another reverse proxy in front of this stack, keep the same split:

- public host -> proxy port `3000`
- internal admin host -> proxy port `3001`
- MinIO public host -> `MINIO_PUBLIC_URL`

## 7. Verify the Deployment

After startup, verify:

1. The site opens at your public `APP_URL`
2. The admin login opens only at `ADMIN_APP_URL`
3. Registration works with the configured invite code
4. The seeded admin can sign in through `ADMIN_APP_URL/admin-login`
5. A user can create a box
6. A visitor can submit a question
7. An uploaded image is publicly visible through `MINIO_PUBLIC_URL`

Useful checks:

```bash
docker compose logs --tail=200 proxy
docker compose logs --tail=200 web
docker compose logs --tail=200 db
docker compose logs --tail=200 storage
```

## 8. Updating to a New Version

When deploying a new commit:

```bash
git pull
docker compose up --build -d
```

Because the `web` container runs `prisma migrate deploy` during startup, new migrations are applied automatically as long as the database is reachable.

## 9. Restart and Recovery Commands

Restart everything:

```bash
docker compose restart
```

Restart only the app:

```bash
docker compose restart proxy web
```

Stop without removing volumes:

```bash
docker compose down
```

Stop and remove volumes:

```bash
docker compose down -v
```

Be careful with `-v`: it deletes PostgreSQL and MinIO data.

## 10. Common Issues

### Database migrations keep retrying

Check whether PostgreSQL is healthy:

```bash
docker compose ps
docker compose logs db
```

If `web` cannot reach `db:5432`, migrations will fail and retry inside `scripts/start-web.sh`.

### Images do not load publicly

Usually one of these is wrong:

- `MINIO_PUBLIC_URL`
- reverse proxy route for MinIO
- bucket initialization failed

Check:

```bash
docker compose logs proxy
docker compose logs web
docker compose logs storage
```

### Seed admin or invite code is not what you expect

The seed script reads values from `.env` on startup. If you change seed values later, be aware that existing database records may already exist.

### Safari or mobile issues after deployment

Make sure you are testing the latest deployed build and not an older cached asset set. A hard refresh is useful after UI updates.

## 11. Recommended Next Improvements

If you plan to keep Hidden online for real users, the next deployment hardening steps should be:

- move secrets into a proper secret manager
- back up PostgreSQL and MinIO data
- add health monitoring and alerting
- add a reverse proxy config to the repo
- pin the MinIO image tag instead of using `latest`
