# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Austin Spraggins built with Next.js 14, React 18, TypeScript, and Tailwind CSS. Live at [spragginsdesigns.xyz](https://spragginsdesigns.xyz/).

## Commands

```bash
pnpm dev      # Start development server (runs on localhost:3000)
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Architecture

### Directory Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components (Hero, About, Projects, Skills, GitHubShowcase, Contact, Footer, Header, Layout)
- `src/pages/api/` - API routes (uses Pages Router for API compatibility)
- `public/` - Static assets including favicon variants

### Routing Pattern

This project uses a **hybrid routing approach**:
- **App Router** (`src/app/`) for pages and layouts
- **Pages Router** (`src/pages/api/`) for API routes

### Key Components

The main page (`src/app/page.tsx`) renders sections in order: Hero > About > Projects > Skills > GitHubShowcase > Contact > Footer

The Layout component (`src/components/Layout.tsx`) wraps all pages with the Header.

### API Routes

- `/api/send-email` - Contact form submission using Nodemailer (Gmail SMTP)
- `/api/youtube-stats` - Fetches YouTube channel statistics

### Environment Variables

Required in `.env.local`:
- `GMAIL_APP_PASSWORD` - Gmail app password for contact form
- `YOUTUBE_API_KEY` - YouTube Data API key

### Styling

- Tailwind CSS with custom color palette defined in `tailwind.config.ts`
- Custom fonts: Inter (body) and Poppins (headings) via next/font/google
- Path alias: `@/*` maps to `./src/*`
