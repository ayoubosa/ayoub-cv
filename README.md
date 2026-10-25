# Ayoub Osama Ayoub — Portfolio + CV

A luxury, dark-themed personal portfolio and CV website built with Next.js 14, TypeScript, Tailwind CSS, and Prisma. Features a public marketing site and a secure admin dashboard that controls 100% of the content.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + React + TypeScript (strict)
- **Styling:** Tailwind CSS + CSS variables for theme tokens
- **Animation:** Framer Motion (respects `prefers-reduced-motion`)
- **Backend:** Next.js Route Handlers (`app/api/**`)
- **Database:** SQLite (dev) / PostgreSQL (production) via Prisma ORM
- **Auth:** Admin email + password → JWT (httpOnly cookies). bcrypt hashing.
- **Charts:** Recharts
- **i18n:** EN + AR with full RTL support
- **Email:** Nodemailer behind a `sendEmail()` helper

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values (SMTP, JWT secrets, etc.)

# Initialize database and seed
npx prisma migrate dev
npx prisma db seed

# Start dev server
npm run dev
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma migrate dev` | Create/apply database migrations |
| `npx prisma db seed` | Seed database with sample data |
| `npx prisma studio` | Open Prisma Studio (GUI) |

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Database connection string |
| `JWT_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | From email address |
| `SMTP_TO` | Email to receive contact messages |
| `NEXT_PUBLIC_APP_URL` | Public URL of the app |

## Folder Structure

```
src/
  app/
    (public)/       # Public site routes
    (admin)/admin/  # Protected dashboard routes
    api/            # Route handlers
  components/
    ui/             # UI primitives (GlassCard, GradientButton)
    sections/       # Hero, About, Skills, etc.
    admin/          # Admin dashboard components
  lib/
    db.ts           # Prisma client singleton
    auth.ts         # JWT sign/verify, password hashing
    storage.ts      # File upload abstraction
    analytics.ts    # Event ingestion + aggregation
    i18n/           # Locale config
prisma/
  schema.prisma     # Database schema
  seed.ts           # Seed data
public/
  uploads/          # User-managed files
messages/           # en.json, ar.json
```

## Deployment

### Production Database

For production, switch from SQLite to PostgreSQL:

1. Update `prisma/schema.prisma` datasource to use `postgresql`
2. Set `DATABASE_URL` to your PostgreSQL connection string
3. Run `npx prisma migrate deploy`

### Build

```bash
npm run build
npm start
```

### Vercel (Recommended)

Deploy to Vercel for zero-config hosting. Set all environment variables in the Vercel dashboard.

## Features

- **Public Site:** Hero, About, Skills, Experience, Education, Projects, Services, Testimonials, Contact, Blog
- **Admin Dashboard:** Full CRUD for all content, theme customization, resume upload
- **Analytics:** Page views, visitor stats, device/browser/country breakdowns with Recharts
- **Smart Links:** QR-code-enabled redirect links with click tracking
- **PWA:** Service worker, web manifest, offline fallback, installable
- **i18n:** English + Arabic with RTL support
- **GDPR:** Cookie consent banner with granular opt-in
- **SEO:** JSON-LD structured data, sitemap.xml, robots.txt, Open Graph / Twitter cards
- **Security:** Rate limiting, httpOnly JWT cookies, input validation (zod), secure headers
- **Accessibility:** Respects prefers-reduced-motion, focus states, contrast

## License

MIT
