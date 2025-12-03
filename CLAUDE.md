# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for **Austin Spraggins** - Co-Founder, CTO & Senior Software Engineer at **LineCrush Inc**. Built with Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui, and Aceternity UI components. Live at [spragginsdesigns.xyz](https://www.spragginsdesigns.xyz/).

**Purpose:** Showcase professional work, experience, and technical expertise. This portfolio represents 2+ years of intensive full-stack development experience at LineCrush, building production systems at scale.

## About Austin

### Professional

- **Current Role:** Co-Founder, CTO & Senior Software Engineer at LineCrush Inc
- **Company:** [LineCrush](https://www.linecrush.com) - Sports analytics platform
- **Experience:** End-to-end ownership across the entire stack:
  - Frontend: Next.js 15, React (353+ components), TypeScript, Tailwind CSS
  - Backend: Python (45+ microservices), Node.js
  - Database: PostgreSQL/Neon (100+ tables), Redis caching
  - AI/ML: OpenAI, Anthropic, Perplexity, Google Vision (4+ LLM integrations)
  - Infrastructure: AWS (S3, SES, CloudFront), Ubuntu VPS, Vercel, Docker
  - Data: Web scrapers, real-time pipelines, NLP, cron jobs
- **Education:** AA in Web Development (5+ years in college, consistently high grades)
- **Teaching:** Former Web Development instructor at Bitwise Industries and Geekwise Academy
- **Status:** Open to contracts & consulting

### Personal

- **Location:** Fresno, California (grew up in the mountains of O'Neals, CA)
- **Family:** Proud father of two children - Julian and Lilly
- **Faith:** Christian - faith is central to his life and work
- **Background:** Lost his father at age 8; later cared for his mother when she became blind. Former truck driver before transitioning to tech. Went through a transformative life experience that profoundly changed his perspective, helping him find faith, inner peace, and renewed purpose.

### Values & Approach

- **Mission:** To serve God, be a good father and provider, and build technology that makes the world more intelligent, loving, and just
- **Problem-Solving Style:** Thinks through problems deeply, plans carefully, and takes things step by step - testing and adjusting along the way. Prefers to understand every part of a plan before attempting it.
- **Core Beliefs:**
  - Technology should extend human gifts, not replace them
  - Kindness, respect, and honesty in all interactions
  - Building meaningful tools that honor God

### Personal Projects

- **Bible AI Explorer:** An app to help users understand the Bible better with AI assistance (the AI is instructed to act as a believer in Christ)

## Social Links

- **GitHub:** [github.com/spragginsdesigns](https://github.com/spragginsdesigns)
- **LinkedIn:** [linkedin.com/in/spragginsdesigns](https://www.linkedin.com/in/spragginsdesigns/)
- **Twitter:** [@spragginsdesign](https://twitter.com/spragginsdesign)

## Commands

```bash
pnpm dev      # Start development server (runs on localhost:3000)
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata/SEO
│   ├── page.tsx        # Main page composing all sections
│   ├── globals.css     # Global styles + CSS variables
│   ├── sitemap.ts      # Auto-generated sitemap.xml
│   └── robots.ts       # Auto-generated robots.txt
├── components/
│   ├── ui/             # shadcn/ui + Aceternity UI components
│   │   ├── background-lines.tsx   # Animated SVG background
│   │   ├── text-generate-effect.tsx # Word-by-word text animation
│   │   ├── timeline.tsx           # Scroll-animated timeline
│   │   ├── card.tsx               # shadcn Card component
│   │   ├── badge.tsx              # shadcn Badge component
│   │   └── button.tsx             # shadcn Button component
│   ├── Hero.tsx        # Full-screen hero with BackgroundLines
│   ├── About.tsx       # Timeline-based journey section
│   ├── Expertise.tsx   # Bento grid skills + stats
│   ├── Projects.tsx    # Featured projects showcase
│   ├── Contact.tsx     # Contact form
│   ├── Footer.tsx      # Site footer
│   ├── Header.tsx      # Navigation header
│   └── Layout.tsx      # Page wrapper
├── lib/
│   └── utils.ts        # cn() utility for Tailwind merging
└── pages/api/          # API routes (Pages Router)
    ├── send-email.ts   # Contact form handler
    └── youtube-stats.ts # YouTube API integration
```

### Routing Pattern

This project uses a **hybrid routing approach**:
- **App Router** (`src/app/`) for pages, layouts, and SEO files
- **Pages Router** (`src/pages/api/`) for API routes

### Key Sections

The main page (`src/app/page.tsx`) renders sections in order:
1. **Hero** - Full-screen intro with BackgroundLines animation, profile image, role badges, TextGenerateEffect tagline
2. **About** - Timeline component showing journey from truck driver to CTO
3. **Expertise** - Bento grid with stats row (353+ components, 45+ services, 100+ tables, etc.) and 6 expertise cards
4. **Projects** - LineCrush flagship + 4 featured GitHub projects + 8 additional projects grid
5. **Contact** - Email contact form
6. **Footer** - Social links and copyright

### UI Components

**From shadcn/ui:**
- Card, Badge, Button

**From Aceternity UI (customized):**
- BackgroundLines - Animated SVG paths with cyan color scheme
- TextGenerateEffect - Blur-in word-by-word text animation
- Timeline - Scroll-progress animated timeline

### API Routes

- `/api/send-email` - Contact form submission using Nodemailer (Gmail SMTP)
- `/api/youtube-stats` - Fetches YouTube channel statistics

### Environment Variables

Required in `.env.local`:
```
GMAIL_APP_PASSWORD=     # Gmail app password for contact form
YOUTUBE_API_KEY=        # YouTube Data API key
```

### Styling

- **Tailwind CSS** with CSS variables for theming
- **Dark cyberpunk theme** - Primary cyan (#5ce1e6), dark background
- **Fonts:** Inter (body), Poppins (headings) via next/font/google
- **Path alias:** `@/*` maps to `./src/*`

### SEO

- **Title:** "Austin Spraggins | Co-Founder & CTO | Senior Software Engineer"
- **Sitemap:** Auto-generated at `/sitemap.xml`
- **Robots:** Auto-generated at `/robots.txt`
- **Open Graph & Twitter cards** configured for social sharing

## Content Guidelines

When updating portfolio content:
- **LineCrush** is the flagship project - emphasize scale (353+ components, 100+ tables, etc.)
- Highlight CTO leadership and architectural decision-making
- Emphasize "Open to Contracts & Consulting" (not job seeking)
- Keep stats accurate: 2+ years production, 4+ LLM integrations, 100+ database tables
- Featured GitHub projects: SaveALife CPR, Constrong, Bible AI Explorer, AI Tutor WebApp
- **IMPORTANT:** When referencing Austin's transformative life experience, describe it as a "difficult period" or "challenging time" that led to personal growth, finding faith, and renewed purpose. Never be more specific than this.

## Dependencies

Key packages:
- `next` 14.2.5 - React framework
- `react` 18 - UI library
- `motion` - Framer Motion animations
- `tailwindcss` - Utility CSS
- `lucide-react` - Icons
- `class-variance-authority` - Component variants (shadcn)
- `clsx` + `tailwind-merge` - Class utilities
