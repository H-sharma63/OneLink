# Contributing to OneLink

Thanks for taking the time to contribute! OneLink is an open-source Linktree alternative built with Next.js, Prisma, and Google OAuth. Every contribution — big or small — is appreciated.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Local Setup](#local-setup)
- [How to Contribute](#how-to-contribute)
- [Issue Labels](#issue-labels)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Code Guidelines](#code-guidelines)
- [Commit Convention](#commit-convention)

---

## Getting Started

1. **Fork** this repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/OneLink.git
   cd OneLink
   ```
3. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Local Setup

### Prerequisites

- Node.js v18+
- npm or pnpm
- A PostgreSQL database (local or [Neon](https://neon.tech))
- A [Google Cloud](https://console.cloud.google.com/) project with OAuth 2.0 credentials
- A [Cloudinary](https://cloudinary.com/) account

### Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory:
   ```env
   # NextAuth
   NEXTAUTH_SECRET=          # Generate: openssl rand -hex 32
   NEXTAUTH_URL=http://localhost:3000

   # Google OAuth
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=

   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/onelink
   ```

3. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) — you're good to go.

---

## How to Contribute

### Good First Issues

Look for issues tagged [`good first issue`](https://github.com/H-sharma63/OneLink/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) — these are scoped, well-defined tasks ideal for first-time contributors.

### Feature Requests & Bug Reports

- Search [existing issues](https://github.com/H-sharma63/OneLink/issues) before opening a new one
- Use the issue templates provided
- Be as specific as possible — reproduction steps, screenshots, or code snippets help a lot

### What to Work On

Here are some areas actively looking for contributions:

| Area | Examples |
|------|----------|
| **New Themes** | Add a theme to `getThemeClasses()` in `dashboard/page.tsx` and `[username]/page.tsx` |
| **Social Platforms** | Add TikTok, Discord, Twitch, Bluesky to the socials section |
| **Analytics** | Date-range filters, top link chart, export to CSV |
| **Mobile Dashboard** | Improve dashboard layout on small screens |
| **Accessibility** | ARIA labels, keyboard navigation, focus management |
| **Internationalization** | i18n support for multiple languages |
| **Tests** | Unit or integration tests for API routes and components |
| **Bug Fixes** | Check open issues for reported bugs |

---

## Issue Labels

| Label | Meaning |
|-------|---------|
| `good first issue` | Great for newcomers, well scoped |
| `help wanted` | Maintainer wants community input |
| `enhancement` | New feature or improvement |
| `bug` | Something is broken |
| `documentation` | README, comments, guides |
| `accessibility` | A11y improvements |
| `design` | UI/UX work |

---

## Pull Request Guidelines

1. **One PR per change** — keep it focused and reviewable
2. **Link the related issue** in your PR description using `Closes #issue-number`
3. **Describe what you changed and why** — not just what files you touched
4. **Test your changes locally** before submitting
5. **Do not push generated files** like `.next/`, `node_modules/`, or `generated/prisma/` (already in `.gitignore`)

### PR Title Format

```
type: short description

Examples:
feat: add TikTok to social handles
fix: resolve drag-and-drop order reset on refresh
docs: update env variable setup in README
```

---

## Code Guidelines

- **TypeScript required** — avoid `any` types where possible
- **Tailwind CSS only** — no inline styles unless absolutely necessary
- **Server Components by default** — use `"use client"` only when you need hooks or browser APIs
- **Prisma for all DB operations** — no raw SQL
- **Follow existing patterns** in `app/api/` for new API routes
- **Add or update types** in the `types/` folder when needed

### Linting

Run ESLint before submitting:
```bash
npm run lint
```

---

## Commit Convention

Use clear, descriptive commit messages:

```
feat: add Discord social handle
fix: correct link order after drag-and-drop
style: improve mobile padding on dashboard
docs: add CONTRIBUTING.md
chore: update prisma client
```

---

## Questions?

Open a [Discussion](https://github.com/H-sharma63/OneLink/discussions) or drop a comment on the relevant issue. Happy to help.

---

**Built with precision by [H-sharma63](https://github.com/H-sharma63)**
