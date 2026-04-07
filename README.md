<div align="center">

<h1>⚡ OneLink</h1>

<p><strong>One link for everything. Perfectly minimal.</strong></p>

<p>A high-performance, Linktree-style bio-link platform built with Next.js 16. Create a stunning public profile in seconds — add all your links, connect your socials, pick a theme, and share your single custom URL with the world.</p>

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.5-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)

</div>

---

## ✨ Features

- **🔐 Google OAuth** — Sign in instantly with your Google account via NextAuth.js
- **🎨 11 Themes** — Choose from Obsidian, Ocean Glow, Terminal, Sunset, Bubblegum, Cyberpunk, Forest, Dracula, Monochrome, Midnight, Lavender, and more
- **🔗 Link Management** — Add, toggle, reorder (drag & drop), and delete links with click-count tracking
- **📸 Image Uploads** — Upload a profile avatar and per-link thumbnails via Cloudinary
- **🌐 Social Handles** — Connect Instagram, Twitter, GitHub, LinkedIn, YouTube & your personal website
- **📊 Analytics Dashboard** — Track total profile views and per-link click counts with a visual bar chart
- **📱 Live Phone Preview** — Real-time mobile preview of your public profile right inside the dashboard
- **🚀 Public Profile Page** — A beautiful, SEO-ready public page at `yoursite.com/@username`
- **🧭 Guided Onboarding** — 5-step onboarding flow for first-time users (goal → theme → platforms → links → profile)
- **⚙️ Settings** — Manage profile details, username, banner, layout, and account deletion
- **🔒 Protected Routes** — Middleware-enforced auth guards for dashboard, setup, and onboarding pages
- **🔄 Auto Metadata Fetch** — Paste a URL when adding a link and the title & thumbnail are fetched automatically

---

## 🖼️ App Pages Overview

| Route | Description |
|---|---|
| `/` | Landing page — hero + features + CTA |
| `/login` | Google OAuth sign-in |
| `/setup` | First-time username claiming |
| `/onboarding` | 5-step guided setup wizard |
| `/dashboard` | Link manager + live phone preview + profile editor |
| `/dashboard/analytics` | Profile views & per-link click chart |
| `/dashboard/settings` | Account settings, theme config, account deletion |
| `/@username` | Public profile page (shareable URL) |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Components) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Database** | PostgreSQL via [Prisma ORM](https://www.prisma.io/) |
| **Auth** | [NextAuth.js v4](https://next-auth.js.org/) (Google Provider, JWT sessions) |
| **File Storage** | [Cloudinary](https://cloudinary.com/) (avatar + link thumbnails) |
| **Drag & Drop** | [@dnd-kit](https://dndkit.com/) (sortable link list) |
| **Charts** | [Recharts](https://recharts.org/) (analytics bar chart) |
| **Icons** | [react-icons](https://react-icons.github.io/react-icons/) (Feather Icons) |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A [PostgreSQL](https://www.postgresql.org/) database (local or hosted e.g. [Neon](https://neon.tech/), [Supabase](https://supabase.com/))
- A [Google Cloud](https://console.cloud.google.com/) project with OAuth 2.0 credentials
- A [Cloudinary](https://cloudinary.com/) account

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/onelink.git
cd onelink
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root and add the following:

```env
# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_here       # Generate with: openssl rand -hex 32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary (from cloudinary.com dashboard)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# PostgreSQL Database URL
DATABASE_URL=postgresql://user:password@localhost:5432/onelink
```

> **Tip:** You can generate a secure `NEXTAUTH_SECRET` by running `openssl rand -hex 32` in your terminal.

---

### 4. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Navigate to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
4. Set **Application type** to `Web application`
5. Add the following to **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (for local development)
   - `https://your-production-domain.com/api/auth/callback/google` (for production)
6. Copy the **Client ID** and **Client Secret** into your `.env.local`

---

### 5. Configure Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com/)
2. From your **Dashboard**, copy your **Cloud Name**, **API Key**, and **API Secret**
3. Go to **Settings → Upload → Upload presets** → Create an unsigned preset (name it e.g. `ml_default`)
4. Add all values to your `.env.local`

---

### 6. Set Up the Database

Run the Prisma migration to create the database tables:

```bash
npx prisma migrate dev --name init
```

To view and manage your data with a GUI:

```bash
npx prisma studio
```

---

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

---

## 📁 Project Structure

```
onelink/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── login/                      # Sign-in page
│   ├── setup/                      # Username setup (first login)
│   ├── onboarding/                 # 5-step onboarding wizard
│   ├── dashboard/
│   │   ├── page.tsx                # Main dashboard (links + profile editor)
│   │   ├── layout.tsx              # Sidebar layout
│   │   ├── analytics/              # Analytics page (views + clicks)
│   │   └── settings/               # Settings page
│   ├── [username]/
│   │   └── page.tsx                # Public profile page
│   └── api/
│       ├── auth/[...nextauth]/     # NextAuth handler
│       ├── profile/route.ts        # GET, PATCH, DELETE profile
│       ├── links/
│       │   ├── route.ts            # GET all links, POST new link
│       │   ├── [id]/route.ts       # PATCH, DELETE a single link
│       │   └── metadata/route.ts   # Auto-fetch URL metadata (title, image)
│       ├── upload/route.ts         # Cloudinary upload handler
│       └── user/                   # User-related endpoints
├── components/
│   ├── Providers.tsx               # Session provider wrapper
│   ├── SortableLinkItem.tsx        # Drag-and-drop link list item
│   └── PublicLinkButton.tsx        # Link button on public profile
├── lib/
│   ├── auth.ts                     # NextAuth configuration
│   └── prisma.ts                   # Prisma client singleton
├── prisma/
│   ├── schema.prisma               # Database schema (User, Link, Account, Session)
│   └── migrations/                 # Migration history
├── types/                          # Shared TypeScript types
├── middleware.ts                   # Auth & routing guards
└── next.config.ts                  # Next.js configuration
```

---

## 🗃️ Database Schema

```prisma
model User {
  id          String   @id @default(cuid())
  username    String?  @unique      // Custom public URL handle
  name        String?
  email       String?  @unique
  image       String?               // Avatar (Cloudinary URL)
  bio         String?
  banner      String?               // Banner image (Cloudinary URL)
  theme       String   @default("dark")
  themeConfig Json?                 // Layout, advanced theme options
  socials     Json?                 // Instagram, Twitter, GitHub, etc.
  onboarded   Boolean  @default(false)
  views       Int      @default(0)  // Total profile page views
  links       Link[]
}

model Link {
  id        String   @id @default(cuid())
  title     String
  url       String
  clicks    Int      @default(0)   // Click tracking
  order     Int                    // Drag-and-drop order
  isActive  Boolean  @default(true)
  thumbnail String?                // Link thumbnail (Cloudinary URL)
  icon      String?                // Favicon URL (auto-fetched)
  userId    String
}
```

---

## 🔌 API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/profile` | Get the current user's profile | ✅ Required |
| `PATCH` | `/api/profile` | Update profile (name, bio, theme, socials, etc.) | ✅ Required |
| `DELETE` | `/api/profile` | Delete account and all data | ✅ Required |
| `GET` | `/api/links` | Get all links for the current user | ✅ Required |
| `POST` | `/api/links` | Add a new link | ✅ Required |
| `PATCH` | `/api/links/:id` | Update a link (toggle, reorder, rename) | ✅ Required |
| `DELETE` | `/api/links/:id` | Delete a link | ✅ Required |
| `GET` | `/api/links/metadata?url=` | Fetch title & thumbnail from a URL | ✅ Required |
| `POST` | `/api/upload` | Upload an image to Cloudinary | ✅ Required |

---

## 🎨 Available Themes

| Theme ID | Name | Description |
|---|---|---|
| `dark` | Obsidian | Deep black — the default, ultra-minimal |
| `light` | Clean | Crisp white, soft shadows |
| `ocean` | Ocean Glow | Dark navy with soft blue tones |
| `hacker` | Terminal | Black background, neon green text |
| `sunset` | Sunset | Orange-to-pink gradient |
| `bubblegum` | Bubblegum | Pastel pink, playful |
| `cyberpunk` | Cyberpunk | Bright yellow + black high contrast |
| `forest` | Forest | Deep greens, earthy feel |
| `dracula` | Dracula | Dark purple with pink accents |
| `monochrome` | Monochrome | Pure black & white |
| `midnight` | Midnight | Near-black with teal/cyan accents |
| `lavender` | Lavender | Soft purple tones |

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get involved:

### Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/onelink.git
   ```
3. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Follow the [Getting Started](#-getting-started) steps above to get your local environment running

### Making Changes

- Keep commits focused and atomic (one change per commit)
- Write clear, descriptive commit messages
- Follow the existing code style (TypeScript, functional components, Tailwind utility classes)
- Add or update types in the `types/` folder if needed
- When adding API routes, follow the existing pattern in `app/api/`

### Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name-yourname
   ```
2. Open a **Pull Request** on GitHub against the `main` branch
3. Describe what your PR does and why
4. Link any related issues

### What to Contribute

Here are some ideas if you're looking for where to start:

- 🐛 **Bug fixes** — Check open issues for reported bugs
- 🎨 **New themes** — Add a new theme to the `getThemeClasses` function in `dashboard/page.tsx` and `[username]/page.tsx`
- 📊 **Analytics improvements** — Richer charts, date ranges, top-performing links
- 🧩 **New social platforms** — Add TikTok, Discord, Twitch, etc.
- 📱 **Mobile dashboard** — Improve the dashboard layout on smaller screens
- 🌐 **Internationalization (i18n)** — Multi-language support
- ♿ **Accessibility** — ARIA labels, keyboard navigation improvements
- 🧪 **Tests** — Unit or integration tests for API routes and components

### Code Guidelines

- **TypeScript** is required — avoid `any` types where possible
- **Tailwind CSS** for all styling — no inline CSS unless absolutely necessary
- **Server Components** by default; use `"use client"` only when you need browser APIs or React hooks
- **Prisma** for all database operations — never write raw SQL

---

## ⚙️ Available Scripts

```bash
npm run dev       # Start the development server (http://localhost:3000)
npm run build     # Build for production
npm run start     # Start the production server
npm run lint      # Run ESLint
```

```bash
npx prisma migrate dev   # Apply database migrations in development
npx prisma studio        # Open Prisma Studio (DB GUI)
npx prisma generate      # Re-generate the Prisma client after schema changes
```

---


## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with precision by [H-sharma63](https://github.com/H-sharma63)**

*If you find this project useful, please consider giving it a ⭐ on GitHub!*

</div>
