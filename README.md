# Hold My Reformer

A Pilates class reservation system: members book sessions with credits; you (admin) manage the calendar and add private blocks or group classes.

## Features

- **Member login** – Students sign in and see the calendar.
- **Credits** – Members spend credits to reserve private sessions or join group classes.
- **Calendar** – View and book sessions; calendar updates when you add events or members book.
- **Admin** – Add **blocks** (1:1 private sessions) or **classes** (group sessions with max participants). Click a time slot on the calendar to create an event.

## Setup

1. **Environment**

   Copy `.env.example` to `.env` and set:

   - `DATABASE_URL` – SQLite default: `file:./prisma/dev.db`
   - `NEXTAUTH_SECRET` – required for NextAuth and auth middleware (e.g. `openssl rand -base64 32`)

2. **Database**

   ```bash
   npx prisma migrate dev   # create DB and run migrations
   npm run db:seed          # create admin + sample member
   ```

3. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Seed accounts

After `npm run db:seed`:

| Role   | Email                     | Password  |
|--------|----------------------------|-----------|
| Admin  | sarah.russell@lumenalta.com | admin123  |
| Member | member@example.com          | member123 |

Member starts with 10 credits. Add events as admin, then sign in as member to book.

## Tech

- Next.js 16, React 19, TypeScript
- Prisma 7 + SQLite (adapter: better-sqlite3)
- NextAuth v5 (credentials, JWT, member/admin roles)
- react-big-calendar, date-fns, Tailwind CSS
