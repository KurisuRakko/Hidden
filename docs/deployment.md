# Hidden Deployment Guide

This guide reflects the current Docker-based setup in this repository.

Hidden runs as four containers:

- `proxy`: Nginx split-entry proxy
- `web`: Next.js application
- `db`: PostgreSQL
- `storage`: MinIO

The app startup flow is already automated. On boot, the `web` container:

- runs `prisma migrate deploy`
- seeds the default admin and invite code
- initializes the MinIO bucket and public read policy
- starts the Next.js server

## 1. Choose Your Deployment Mode

Use one of these three operating modes:

1. Local machine
   Use this for development on your own computer.
2. LAN or private network
   Use this when other devices on the same network need access.
3. Internet-facing host
   Use this on a Linux server behind a domain and TLS proxy.

## 2. Prerequisites

- Docker with Compose support
- A writable filesystem for Docker volumes
- Enough resources for PostgreSQL, MinIO, and Next.js together

Recommended minimum:

- 2 vCPU
- 4 GB RAM
- 20 GB free disk

For production, also prepare:

- a public site URL
- a safe admin access path
- a public URL for uploaded media, or a reverse proxy route that exposes MinIO content

## 3. Environment Setup

Start from the example file:

```bash
cp .env.example .env
```

The important variables are:

```env
APP_PORT=3000
ADMIN_PORT=3001

APP_URL=https://hidden.example.com
ADMIN_APP_URL=https://admin.hidden.example.com
ADMIN_BIND_HOST=127.0.0.1

DATABASE_URL=postgresql://hidden:<db-password>@db:5432/hidden?schema=public
POSTGRES_DB=hidden
POSTGRES_USER=hidden
POSTGRES_PASSWORD=<db-password>

SESSION_SECRET=<long-random-secret>
IP_HASH_SECRET=<long-random-secret>

MINIO_ENDPOINT=storage
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=<minio-user>
MINIO_SECRET_KEY=<minio-password>
MINIO_BUCKET=hidden-media
MINIO_PUBLIC_URL=https://media.hidden.example.com

SEED_ADMIN_PHONE=+10000000000
SEED_ADMIN_PASSWORD=<strong-admin-password>
SEED_DEFAULT_INVITE=<invite-code>
```

### What Each Variable Controls

- `APP_PORT`: host port for the public site
- `ADMIN_PORT`: host port for the admin listener
- `APP_URL`: public-facing app URL used for redirects
- `ADMIN_APP_URL`: admin-facing URL used for admin redirects
- `ADMIN_BIND_HOST`: host interface for the admin listener
- `DATABASE_URL`: Prisma connection string; keep `db` as hostname with this Compose stack
- `MINIO_PUBLIC_URL`: browser-reachable base URL for uploaded files

### Rules That Matter

- Change all default secrets before any non-local deployment.
- `APP_URL` and `ADMIN_APP_URL` must match the URLs users actually open.
- If port `3000` or `3001` is taken on the host, change `APP_PORT` or `ADMIN_PORT`.
- Keep `ADMIN_BIND_HOST=127.0.0.1` when the admin portal should stay local-only.

## 4. Deployment Patterns

### Local Machine

Example:

```env
APP_PORT=3000
ADMIN_PORT=3301
APP_URL=http://localhost:3000
ADMIN_APP_URL=http://localhost:3301
ADMIN_BIND_HOST=0.0.0.0
MINIO_PUBLIC_URL=http://localhost:9000
```

This is useful when another app already occupies `3001`.

### LAN or Private Network

Example:

```env
APP_PORT=3000
ADMIN_PORT=3001
APP_URL=http://192.168.1.20:3000
ADMIN_APP_URL=http://192.168.1.20:3001
ADMIN_BIND_HOST=0.0.0.0
MINIO_PUBLIC_URL=http://192.168.1.20:9000
```

Use the real LAN IP of the host. This allows phones or other computers on the same network to open the public site and admin login.

### Internet-Facing Host

Recommended shape:

```env
APP_PORT=3000
ADMIN_PORT=3001
APP_URL=https://hidden.example.com
ADMIN_APP_URL=https://admin.hidden.example.com
ADMIN_BIND_HOST=127.0.0.1
MINIO_PUBLIC_URL=https://media.hidden.example.com
```

Recommended topology:

- public reverse proxy forwards public traffic to `APP_PORT`
- internal-only reverse proxy, VPN, or SSH tunnel reaches `ADMIN_PORT`
- uploaded media is exposed through `MINIO_PUBLIC_URL`

Do not expose the admin listener broadly unless you intentionally protect it with network controls.

## 5. Start the Stack

Build and start:

```bash
docker compose up --build -d
```

Check status:

```bash
docker compose ps
```

Watch startup logs:

```bash
docker compose logs -f web proxy
```

Named volumes are already configured:

- `hidden-db`
- `hidden-storage`

These persist PostgreSQL and MinIO data across restarts.

## 6. How Routing Works

The included Nginx config lives at `docker/nginx/hidden.conf`.

Current behavior:

- public listener serves the normal app
- public listener blocks `/admin`, `/admin-login`, and `/api/admin`
- admin listener serves `/admin-login`, `/admin`, `/api/admin`, shared assets, and auth routes
- admin listener injects `x-hidden-admin-portal: 1`

That injected header is required by the app to distinguish admin traffic from public traffic.

## 7. Verification Checklist

After deployment, verify these in order:

1. `docker compose ps` shows `db`, `storage`, and `web` as healthy
2. the public site opens at `APP_URL`
3. the admin login opens at `ADMIN_APP_URL/admin-login`
4. registration works with `SEED_DEFAULT_INVITE`
5. the seeded admin can sign in only through the admin entry point
6. a normal user can create a box
7. a visitor can submit a question
8. a published answer appears on the public box page
9. uploaded media resolves through `MINIO_PUBLIC_URL`

Useful commands:

```bash
docker compose logs --tail=200 proxy
docker compose logs --tail=200 web
docker compose logs --tail=200 db
docker compose logs --tail=200 storage
```

## 8. Updating an Existing Deployment

Pull the new code and rebuild:

```bash
git pull
docker compose up --build -d
```

Because startup already runs `prisma migrate deploy`, new migrations are applied automatically if the database is reachable.

## 9. Restart and Recovery

Restart everything:

```bash
docker compose restart
```

Restart only app-facing services:

```bash
docker compose restart proxy web
```

Stop containers but keep data:

```bash
docker compose down
```

Delete containers and named volumes:

```bash
docker compose down -v
```

Be careful with `-v`: it deletes PostgreSQL and MinIO data.

## 10. Troubleshooting

### Admin redirects point to the wrong host or port

Check:

- `APP_URL`
- `ADMIN_APP_URL`
- `APP_PORT`
- `ADMIN_PORT`
- the host or reverse proxy headers reaching Nginx

The app now depends on the forwarded host and port being preserved correctly.

### The admin listener does not start

Usually this means:

- `ADMIN_PORT` is already in use
- `ADMIN_BIND_HOST` is invalid for the host

Try:

```bash
docker compose ps
docker compose logs proxy
```

Then change `ADMIN_PORT` or `ADMIN_BIND_HOST` in `.env`.

### The web container keeps retrying migrations

Check PostgreSQL health:

```bash
docker compose ps
docker compose logs db
```

If `web` cannot reach `db:5432`, startup will keep retrying inside `scripts/start-web.sh`.

### Public images do not load

Most often one of these is wrong:

- `MINIO_PUBLIC_URL`
- the public route to MinIO
- MinIO credentials or bucket initialization

Check:

```bash
docker compose logs web
docker compose logs storage
```

### Public box page returns 404

That is expected when:

- the box slug does not exist
- the box is hidden
- the box is disabled

Only active boxes are public.

## 11. Hardening Recommendations

If Hidden is going to serve real users, do these next:

- move secrets out of `.env` into a proper secret manager
- back up PostgreSQL and MinIO volumes
- pin the MinIO image instead of `latest`
- add host firewall rules for the admin listener
- terminate TLS in a dedicated reverse proxy
- add uptime and log monitoring
