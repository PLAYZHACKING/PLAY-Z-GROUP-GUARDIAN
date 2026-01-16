# P-Z AI Group Guardian

## Overview

This is a full-stack AI chat application called "P-Z AI Group Guardian" - an AI-powered chatbot interface with a "Group Guardian" security-themed aesthetic. The application provides a conversational AI interface that communicates with an external AI API, featuring a premium dark mode design with shield-like, secure visual elements.

The frontend is a React single-page application with animated chat bubbles and markdown rendering. The backend is an Express.js server that proxies AI requests to an external API endpoint, with PostgreSQL database support for message logging.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with CSS variables for theming, custom dark purple/blue "Guardian" theme
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for chat bubble animations and page transitions
- **Markdown**: react-markdown with remark-gfm for rendering AI responses
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with tsx for TypeScript execution
- **API Design**: Single GET endpoint `/api/generate?q={message}` that proxies to external AI service
- **Request Signing**: SHA-256 hash-based request signing with timestamp for external API authentication
- **Static Serving**: Vite dev server in development, static file serving in production

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` - contains `messages` table for logging chat interactions
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)
- **Connection**: pg Pool with `DATABASE_URL` environment variable

### Project Structure
- `client/` - React frontend application
- `server/` - Express backend with API routes
- `shared/` - Shared TypeScript types, schemas, and route definitions
- `script/` - Build scripts for production bundling

### API Contract
- Routes defined in `shared/routes.ts` with Zod schemas for type-safe validation
- Response format includes `response` (AI text), `Join` (Telegram link), `status`, and `successful` fields
- Error responses follow consistent structure with `error`, `status`, and `successful` fields

### Build System
- Development: Vite HMR for frontend, tsx for backend
- Production: esbuild bundles server to single file, Vite builds static frontend
- Vercel-ready deployment configuration included

## External Dependencies

### External AI Service
- Proxies chat requests to an external AI API (URL constructed in routes.ts)
- Uses SHA-256 signing with timestamp for request authentication
- Randomized User-Agent headers for requests

### Database
- PostgreSQL database required (connection via `DATABASE_URL` environment variable)
- Uses `connect-pg-simple` for session storage capability

### Third-Party Services
- Google Fonts (Outfit, Space Grotesk, DM Sans, Fira Code, Geist Mono, Architects Daughter)
- Telegram integration (join links returned in API responses)

### Key NPM Packages
- `drizzle-orm` / `drizzle-zod` - Database ORM and Zod schema generation
- `framer-motion` - Animation library
- `react-markdown` / `remark-gfm` - Markdown rendering
- `@tanstack/react-query` - Data fetching and caching
- `@radix-ui/*` - Accessible UI primitives
- `zod` - Runtime type validation