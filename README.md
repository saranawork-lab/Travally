# Travally — Social Travel Companion & Activity Discovery Platform

**Travally** is a modern, responsive, mobile-first social discovery web application that connects people based on shared activities, cultural interests, travel destinations, dates, schedules, and personal preferences.

The platform provides two distinct, interconnected modes under a unified user account, profile, authentication system, and messaging architecture:
1. **Companion Mode**: Activity-based discovery for everyday experiences (Movies, Food & Cafes, Walking, Studying, Events, City Exploration).
2. **Travel Mode**: Destination trip companion matching with defined 5-factor transparent compatibility scoring.

---

## 🚀 Live Tech Stack

- **Frontend & App Framework**: [Next.js 14 (App Router)](https://nextjs.org/) with React 18 & TypeScript.
- **Styling & Design System**: Tailwind CSS with curated ambient tokens, glassmorphism, micro-animations, mobile bottom navigation bar, tablet column layouts, and widescreen discovery feeds.
- **ORM & Database**: [Prisma ORM](https://www.prisma.io/) with SQLite (local development) and 1-click compatibility with PostgreSQL / [Supabase](https://supabase.com/).
- **Authentication Layer**: Secure JWT session cookies with multi-provider abstraction ready for Supabase Auth, NextAuth, or custom SSO.
- **Scoring Engine**: Deterministic, transparent 5-factor mathematical matrix explaining why travel companions are recommended.
- **SEO & Discoverability**: Semantic HTML5, metadata, Open Graph cards, dynamic XML sitemaps, robots.txt exclusions for private data, and pre-rendered category and destination hubs.

---

## 🧭 Key Features & Workflows

### 1. Unified Navigation & Mode Switcher
- Instant toggle between **Companion Mode** and **Travel Mode** from the top navbar or mobile header.
- Dynamic feed, filters, and forms adapt automatically without requiring re-authentication.

### 2. Companion Mode (Everyday Activities)
- Structured activities across **Movies, Food & Cafes, Walking, Studying, Events, Shopping, City Exploration, Other**.
- Step-by-step interactive posting flow: select activity tags first, then slide into details.
- Structured metadata: exact date, start time, duration, cutoff window, and gender preferences.
- Time-sensitive cutoff enforcement (e.g. 2 hours before movie start).
- Private join request workflow ("I'm Interested") with separate confirmation modal and cancellation support.

### 3. Travel Mode (Trip Matching & Transparent Scoring)
- Multi-day trip planning: destination, departure city, travel style (Cultural, Slow Travel, Backpacking, Adventure, Luxury, Road Trip), budget range, planned attractions, accommodation and transport preferences.
- **Transparent Compatibility Algorithm**:
  - Destination & Region match (35%)
  - Date overlap ratio (25%)
  - Travel style compatibility (20%)
  - Shared interests & passions (15%)
  - Budget range alignment (5%)
- Interactive breakdown dialog detailing the exact math behind every recommendation.

### 4. Centralized Request Management (`/requests`)
- **Received Requests (Organizer Dashboard)**: Inspect applicant profiles, bio, verification badges, and introductory notes. Accept or decline requests.
- **Capacity Enforcement**: When capacity is reached, new requests close automatically. Accepting one participant preserves other open requests until capacity is filled.
- **Sent Requests**: Real-time status tracking (Pending, Accepted, Declined, Cancelled).

### 5. Private Messaging (`/chats`)
- Server-verified chat threads strictly unlocked only for confirmed participants and organizers.
- Real-time near-instant message streaming with unread indicators and timestamps.
- One-click user reporting and instant blocking directly from chat.

### 6. Trust, Safety & Admin Dashboard (`/safety` & `/admin`)
- **Safety Center**: Community guidelines, meeting in public safety checklists, travel precautions, zero commercial solicitation policy, and legal disclaimers.
- **Admin Moderation Queue**: Dedicated admin interface to review user/activity reports, dismiss false flags, or resolve and log enforcement actions.

### 7. Multi-Account Persona Switcher (Development/Demo Mode)
- Floating button at the bottom-right allows instant 1-click switching between test personas:
  - **Sarah Jenkins** (`sarah@travally.app`): SF Film host & organizer.
  - **Alex Rivera** (`alex@travally.app`): Architecture explorer & active applicant.
  - **Maya Chen** (`maya@travally.app`): Tokyo & Kyoto travel plan host.
  - **David Ross** (`david@travally.app`): Interlaken adventure host.
  - **Elena Rostova** (`elena@travally.app`): Literature researcher & study companion.
  - **Admin Moderator** (`admin@travally.app`): Trust & Safety team with `/admin` access.
  - Password for all seed accounts: `Password123!`

---

## 🛠️ Getting Started & Local Setup

### Prerequisites
- Node.js 18+ (tested on Node v24.15)
- npm 9+

### 1. Installation
```bash
npm install
```

### 2. Database Setup & Seeding
```bash
# Push schema to SQLite database
npx prisma db push

# Populate with realistic test personas, activities, and trips
npm run db:seed
```

### 3. Running Development Server
```bash
npm run dev
# Server will start on http://localhost:3000
```

### 4. Running Production Build
```bash
npm run build
npm run start
```

---

## 🔑 External Providers Configuration Guide

When you are ready to configure production services, update `.env`:

### 1. Supabase (Database & Auth)
1. Create a project on [Supabase.com](https://supabase.com/).
2. In Project Settings > Database, copy the connection string.
3. Update `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```
4. Run `npx prisma db push` to generate all tables and foreign keys in PostgreSQL.
5. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 2. LinkedIn OAuth (Profile Connection)
1. Create an app in the [LinkedIn Developer Portal](https://developer.linkedin.com/).
2. Add OAuth 2.0 redirect URL: `https://your-domain.com/api/auth/callback/linkedin`.
3. Set `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET`.

### 3. Identity Verification Provider
To integrate Persona or Stripe Identity:
1. Set `IDENTITY_VERIFICATION_PROVIDER="persona"` (or `"stripe"`).
2. Set `IDENTITY_VERIFICATION_API_KEY="your-api-key"`.
*Travally will never display false verification badges unless the external provider confirms identity.*

### 4. Email Notifications (Resend / SendGrid)
Set `RESEND_API_KEY="re_..."` and `EMAIL_FROM="welcome@yourdomain.com"`.
