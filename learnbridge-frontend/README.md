# LearnBridge — Frontend

A modern skill-learning platform frontend built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. Connects to the LearnBridge backend for authentication, course management, bookings, and more.

---

## Live

| Resource | URL |
|---|---|
| **Frontend** | https://learnbridge-frontend-five.vercel.app |
| **Backend API** | https://learnbridge-backend.vercel.app |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Radix UI primitives) |
| Icons | Lucide React |
| Notifications | Sonner |
| Auth (client) | Cookie-based session token (BetterAuth) |
| Payments | Stripe.js |
| Deployment | Vercel |

---

## Features

- Email/password login & registration
- Google OAuth login (one-click, always as Student)
- OTP-based email verification after signup
- Forgot password with OTP reset flow
- Role-based dashboards: **Admin**, **Tutor**, **Student**
- Course browsing, search, and filtering
- Course enrollment & progress tracking
- Tutor listing and session booking
- Review & rating submission
- Stripe checkout for paid sessions
- AI learning assistant (Claude-powered)
- Dark/light mode support
- Fully responsive, mobile-friendly design

---

## Roles & Dashboards

| Role | Dashboard Path | Access |
|---|---|---|
| **Admin** | `/admin/analytics` | Platform stats, approve trainers & courses |
| **Tutor/Trainer** | `/tutor/dashboard` | Manage courses, view bookings & enrollments |
| **Student** | `/student` | Browse courses, enroll, book sessions, AI chat |

---

## Project Structure

```
src/
├── actions/            # Next.js Server Actions (auth, courses, dashboard)
├── app/
│   ├── (auth)/         # login, register, verify-email, forgot-password
│   ├── (commonLayout)/ # Public pages: home, courses, tutors, about, faq
│   ├── (dashboardLayout)/
│   │   ├── admin/      # Admin dashboard pages
│   │   ├── tutor/      # Tutor dashboard pages
│   │   └── student/    # Student dashboard pages
│   ├── auth/callback/  # Google OAuth callback handler
│   └── api/            # Next.js API routes
├── components/
│   ├── ui/             # shadcn/ui component library
│   └── shared/         # Navbar, footer, sidebar
├── lib/
│   ├── auth.ts         # getCurrentUserFromServer()
│   ├── tokenUtils.ts   # Session cookie helpers
│   └── cookiesUtils.ts
└── hooks/              # Custom React hooks
```

---

## Auth Flow

**Email/Password**
1. Register → OTP sent to email → Verify at `/verify-email`
2. Login → session token stored in cookie → redirect to role dashboard

**Google OAuth**
1. Click "Continue with Google" → backend relay → Google consent screen
2. Google callback → backend auth bridge extracts session token
3. Frontend `/auth/callback` stores token in cookie → redirect to `/student`

**Forgot Password**
1. Enter email → OTP sent → Enter OTP + new password at `/forgot-password`

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/Arifur999/learnbridge-frontend.git
cd learnbridge-frontend
bun install
```

### 2. Configure environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production, set:

```env
NEXT_PUBLIC_BACKEND_URL=https://learnbridge-backend.vercel.app
NEXT_PUBLIC_APP_URL=https://learnbridge-frontend-five.vercel.app
```

### 3. Start dev server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Pages

| Path | Description |
|---|---|
| `/` | Landing page |
| `/courses` | Browse all approved courses |
| `/tutors` | Browse tutors |
| `/about` | About page |
| `/faq` | FAQ page |
| `/login` | Sign in |
| `/register` | Create account |
| `/verify-email` | OTP email verification |
| `/forgot-password` | Password reset via OTP |
| `/student` | Student dashboard home |
| `/student/courses` | Enrolled courses |
| `/student/bookings` | Booked sessions |
| `/student/profile` | Student profile & settings |
| `/student/ai-assistant` | AI learning assistant |
| `/tutor/dashboard` | Tutor dashboard |
| `/tutor/courses` | Tutor's courses |
| `/tutor/bookings` | Tutor's bookings |
| `/tutor/profile` | Tutor profile & teaching details |
| `/admin/analytics` | Admin analytics |
| `/admin/trainers` | Manage trainer approvals |
| `/admin/courses` | Manage course approvals |
| `/admin/categories` | Manage categories |

---

## Default Credentials (Seeded)

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@skillbridge.com | Admin@123 |

Student and Tutor accounts can be created via the Register page.

---

## Deployment (Vercel)

1. Connect the GitHub repository to Vercel
2. Set environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_BACKEND_URL` → `https://learnbridge-backend.vercel.app`
   - `NEXT_PUBLIC_APP_URL` → `https://learnbridge-frontend-five.vercel.app`
3. Deploy — Vercel handles the Next.js build automatically
