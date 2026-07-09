# Cloudflare cloud storage setup

Drawnix cloud storage uses Cloudflare Pages Functions, D1, and R2.

## Create resources

```sh
npx wrangler d1 create drawnix
npx wrangler r2 bucket create drawnix
```

Copy the `database_id` from the D1 command output into `wrangler.toml`.

## Apply the database migration

```sh
npx wrangler d1 migrations apply drawnix --remote
```

For local development:

```sh
npx wrangler d1 migrations apply drawnix --local
npm run build:web
npx wrangler pages dev dist/apps/web --d1=DRAWNIX_DB=drawnix --r2=DRAWNIX_BUCKET=drawnix
```

## Deploy

Keep the existing Pages build settings:

```text
Build command: npm run build:web
Build output directory: dist/apps/web
```

The `functions/` directory is deployed by Cloudflare Pages as `/api/*`.

