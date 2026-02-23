# Wlacz Wizje - B2B Partner Hub Foundation

## Structure

- `apps/backend`: NestJS API for auth, documents, webhook automation, OCI storage integration.
- `apps/frontend`: Next.js + Tailwind client dashboard and login.
- `db/migrations`: Oracle migration files.
- `db/seeds`: Oracle seed files.

## Quick start

1. Install dependencies:
   - `npm install`
2. Copy env templates:
   - `cp apps/backend/.env.example apps/backend/.env`
   - `cp apps/frontend/.env.example apps/frontend/.env.local`
3. Run DB migration and seed:
   - `npm run db:migrate`
   - `npm run db:seed`
4. Run apps in separate terminals:
   - `npm run dev:backend`
   - `npm run dev:frontend`

## Default admin seed

- Email: `admin@wlaczwizje.pl`
- Password: `ChangeMe123!`

Change the password immediately after first login.
