# Petal & Cocoa — Owner Dashboard

## Project Overview

This is the **owner-facing web dashboard** for Petal & Cocoa, a cake shop
management system. The backend is a fully built, documented NestJS + PostgreSQL
REST API (auth, cakes, categories, cart, orders, birthday room reservations,
analytics, email notifications). This repo is the **frontend only** — do not
modify or assume access to backend source code.

The customer-facing storefront is a separate frontend and out of scope here.
This dashboard is for the shop owner to manage the business day-to-day.

## Tech Stack

- **Next.js** (App Router), TypeScript
- **Axios** for API calls
- **Recharts** for analytics charts (revenue, sales-by-period, best sellers)
- **Tailwind CSS** for styling
- Form handling: **react-hook-form** + **zod** for validation, mirroring the
  backend's `class-validator` rules where relevant (required fields, min/max,
  enums)
- Data fetching/caching: **TanStack Query** — prefer this over manual
  `useEffect` + `useState` fetching for anything hitting the API

## Design Direction

- **Clean, intuitive, uncluttered** — this is a working tool the owner uses
  daily to manage orders, not a marketing site. Prioritize clarity and fast
  scanning over decoration.
- **Color palette: pink and brown**, evoking a bakery — pink as the primary
  accent (buttons, active states, highlights), warm brown as a secondary/text
  color, soft neutral/cream backgrounds. Avoid harsh, overly saturated pink —
  aim for a warm, appetizing palette, not a "tech startup" pink.
- Generous whitespace, clear typographic hierarchy, rounded corners fit the
  bakery feel better than sharp edges.
- Data-heavy screens (order lists, analytics) should stay legible — don't let
  decorative styling compromise readability of tables/numbers.

## Backend API

- The full, authoritative API contract is available as OpenAPI/Swagger JSON at:
  `http://localhost:3000/api-json`
  (fetch and read this before building any screen that talks to the API —
  do not guess endpoint shapes)
- Interactive Swagger UI: `http://localhost:3000/api`
- **Auth**: JWT Bearer token. `POST /auth/signin` returns a token; send it as
  `Authorization: Bearer <token>` on all subsequent requests.
- **Roles**: `customer` and `owner`. This dashboard is for `owner`-role users
  only — routes requiring `@Roles('owner')` on the backend are the ones this
  app should call. Handle 401 (not authenticated) and 403 (wrong role)
  distinctly in the UI.
- Some endpoints return raw HTML (`GET /orders/:id/baking-slip`) or CSV file
  downloads (`GET /analytics/export/orders`, `GET /analytics/export/sales`) —
  these are not JSON; handle them as document/file responses, not typical API
  calls.

## Scope — Build in This Order

1. **Auth**: owner login screen, token storage, protected route wrapper
2. **Dashboard home**: `GET /analytics/dashboard` summary cards (today's
   revenue, monthly revenue, order counts, average order value)
3. **Orders**: list with status/date filters (`GET /orders`), detail view,
   status update, payment status update, baking slip view/print
4. **Cakes & Categories**: CRUD, image upload, options/values management
5. **Birthday Rooms**: CRUD, image upload, availability view, reservation
   management
6. **Analytics**: sales charts by period, best sellers, reservation stats,
   CSV export buttons

## Working Conventions

- Feature-based folder structure (`/orders`, `/cakes`, `/analytics`, etc.),
  not one flat `/components` dump.
- Before implementing a screen: explore the relevant part of the Swagger spec,
  propose an implementation plan (components, API calls, state), and wait for
  approval before writing code.
- Never hardcode API URLs, tokens, or credentials — use environment variables.
- This app never needs backend secrets (Cloudinary keys, JWT signing secret,
  SMTP credentials) — if a task seems to require one, stop and ask, don't
  invent a workaround.
- Match backend enums exactly (order status, payment status, reservation
  status, time slots) — read them from the Swagger schema rather than
  guessing string values.