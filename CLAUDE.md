# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for **Austin Spraggins** - CTO & Senior Software Engineer at **LineCrush Inc** (30% owner). Built with Next.js 14, React 18, TypeScript, and Tailwind CSS. Live at [spragginsdesigns.xyz](https://spragginsdesigns.xyz/).

**Purpose:** Showcase professional work, experience, and technical skills in a modern, sleek design. This portfolio represents 2+ years of intensive full-stack development experience at LineCrush, working 12+ hour days on a massive production codebase.

## About Austin

- **Current Role:** CTO & Senior Software Engineer at LineCrush Inc
- **Company:** [LineCrush](https://www.linecrush.com) - Sports analytics platform
- **Experience:** Full-stack development with Next.js, Python, PostgreSQL (Neon), Redis, AWS, Ubuntu VPS infrastructure
- **Background:** Former truck driver turned tech professional, taught Web Development at Bitwise Industries and Geekwise Academy
- **Location:** Fresno, California

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

## Content Guidelines

When updating portfolio content, accurately reflect Austin's role:
- **LineCrush** is the flagship project (formerly ContextPro.AI)
- Emphasize CTO and leadership experience
- Highlight full-stack expertise: Next.js, Python, PostgreSQL, Redis, AWS, VPS management
- Include production-scale experience with scrapers, cronjobs, real-time data pipelines
