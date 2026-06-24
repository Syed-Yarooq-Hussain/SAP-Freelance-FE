# Docker Deploy Guide

## 1. Create env file

Copy `.env.example` to `.env` on the server and update values:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_TEST_MODE=false
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXTAUTH_SECRET=replace-with-a-strong-secret
NEXTAUTH_URL=https://your-frontend-domain.com
APP_PORT=3000
```

Important: `NEXT_PUBLIC_*` values are baked into the Next.js client bundle during `docker build`, so rebuild the image after changing them.

## 2. Build and run with Docker Compose

```bash
docker compose up -d --build
```

App will run on:

```text
http://localhost:3000
```

If you change `APP_PORT`, use that port instead.

## 3. Build and run with Docker only

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://your-backend-domain.com \
  --build-arg NEXT_PUBLIC_TEST_MODE=false \
  --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key \
  --build-arg NEXTAUTH_SECRET=replace-with-a-strong-secret \
  --build-arg NEXTAUTH_URL=https://your-frontend-domain.com \
  -t sap-freelance-fe:latest .
```

```bash
docker run -d \
  --name sap-freelance-fe \
  -p 3000:3000 \
  -e NEXTAUTH_SECRET=replace-with-a-strong-secret \
  -e NEXTAUTH_URL=https://your-frontend-domain.com \
  --restart unless-stopped \
  sap-freelance-fe:latest
```

## 4. Useful commands

```bash
docker compose logs -f
docker compose restart
docker compose down
```
