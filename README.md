# 🎂 Petal & Cocoa — Owner Web Dashboard

> A modern, full-featured administrative web dashboard for **Petal & Cocoa** cake shop management system. Designed for business owners to seamlessly manage daily bakery orders, custom cake catalogs, birthday room reservations, interactive sales analytics, and CSV report exports.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-E07A5F?style=for-the-badge&logo=vercel)](https://petal-and-cocoa-dashboard.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js_16-App_Router-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery)](https://tanstack.com/query/latest)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

---

## 🌐 Deployed Application & Public Demo Access

- **Live Application URL**: [https://petal-and-cocoa-dashboard.vercel.app/](https://petal-and-cocoa-dashboard.vercel.app/)

### 🔑 Demo Owner Credentials (For Interviewers & Recruiters)

| Attribute | Credential Value |
| :--- | :--- |
| **Owner Email** | `owner@cakeshop.com` |
| **Password** | `password123` |
| **Role Scoped** | `owner` (Full Administrative Access) |

> [!NOTE]  
> **Server Cold-Start Notice (Render Free Tier)**  
> The backend NestJS REST API is hosted on Render's free tier. If the application has been inactive, the backend server automatically enters sleep mode. **Your initial login request may take up to 60 seconds** to wake up the server instance. Once active, all subsequent requests and page transitions will respond instantaneously!

---

## ✨ Key Features & Functionality

### 📊 1. Dashboard Overview (`/`)
- **Key Business Metrics**: Instant daily scannable summary cards showing today's revenue, today's order count, monthly revenue, total orders, pending orders, completed orders, cancelled orders, and average order value (AOV).
- **Stat Cards**: Styled in an appetizing bakery pink (`#E07A5F`) and warm chocolate brown (`#3D2314`) palette.

### 📈 2. Business Analytics & Data Visualization (`/analytics`)
- **Interactive Sales Trends**: Dynamic Recharts `ComposedChart` featuring time-period tabs (`Daily`, `Weekly`, `Monthly`, `Annual`) that display revenue curves (`#E07A5F`) alongside order volume line overlays (`#3D2314`).
- **Best-Sellers Leaderboard**: Horizontal Recharts `BarChart` and ranked leaderboard table detailing top cake products by quantity sold and total revenue generated.
- **Birthday Room Statistics**: Recharts **Donut PieChart** for booking status distributions (`Pending`, `Confirmed`, `Completed`, `Cancelled`) and room popularity metrics.
- **Authenticated CSV File Exports**: One-click browser file downloads for **Export Sales CSV** (`GET /analytics/export/sales?period=...`) and **Export Orders CSV** (`GET /analytics/export/orders`).

### 🛒 3. Orders Management (`/orders` & `/orders/[id]`)
- **Filterable Orders List**: Real-time filtering by order status (`CONFIRMED`, `PREPARING`, `READY_FOR_PICK_UP`, `COMPLETED`, `CANCELLED`) and pickup date.
- **Color-Coded Status Badges**: Scannable status indicators for fast daily shop operations.
- **Order Details View**: Full breakdown of customer info, line items, chosen cake customization options, special notes, and itemized subtotal pricing.
- **Order Status Transitions**: Strict logical workflow progression (`CONFIRMED` → `PREPARING` → `READY_FOR_PICK_UP` → `COMPLETED`).
- **Payment Status Update**: Toggle order payment state (`UNPAID` / `PAID`) with real-time feedback.
- **Printable Baking Slip**: One-click action fetching raw HTML baking slips (`GET /orders/:id/baking-slip`) opened in a printable window tab.

### 🍰 4. Cakes Catalog & Customization Tree (`/cakes` & `/cakes/[id]`)
- **Product Management**: Create, edit, and delete cakes with pricing, description, availability toggles, and category assignment.
- **Multi-Image Gallery & Dropzone**: Multipart file upload (`POST /cakes/:id/images`) with Cloudinary integration and photo deletion.
- **Nested Option Builder**: Comprehensive nested customization option tree (e.g., Option: "Size" → Values: "6-inch", "8-inch" with price modifiers).

### 🏷️ 5. Categories Management (`/categories`)
- **Category CRUD**: Manage cake categories with inline creation, editing, and deletion.
- **Conflict Error Surfacing**: Handles backend `409 Conflict` exceptions gracefully when attempting to delete categories with assigned cakes.

### 🎈 6. Birthday Party Rooms & Availability (`/rooms` & `/rooms/[id]`)
- **Party Suites Management**: Create, update, and manage room capacities, reservation prices, and availability flags.
- **Multi-Image Dropzone**: Gallery image manager (`POST /rooms/:id/images`).
- **Time Slot Availability Checker**: Interactive date picker component querying `GET /rooms/:id/availability?date=YYYY-MM-DD` to show open vs. booked fixed time slots (`10:00`, `12:00`, `14:00`).

### 📅 7. Room Reservation Management (`/reservations`)
- **Master Booking List**: Overview of all customer room reservations across party suites.
- **Status & Date Filters**: Quick filtering by reservation status (`pending`, `confirmed`, `completed`, `cancelled`) and date.
- **Reservation Details Modal**: View customer guest count, special birthday requirements, and trigger status updates or cancellations (`PATCH /reservations/:id/cancel`).

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology Used |
| :--- | :--- |
| **Frontend Framework** | **Next.js 16** (App Router), **React 19**, **TypeScript** |
| **Data Fetching & Cache** | **TanStack Query v5** (`@tanstack/react-query`) |
| **HTTP & Auth Client** | **Axios** with JWT Bearer Token interceptor, `js-cookie`, and `localStorage` |
| **Charts & Visualization** | **Recharts** (`ComposedChart`, `BarChart`, `PieChart`, `ResponsiveContainer`) |
| **Styling & Icons** | **Tailwind CSS v4**, **Lucide React** icons |
| **Form & Validation** | **React Hook Form**, **Zod** (`zodResolver`) |
| **Backend API** | **NestJS**, **PostgreSQL**, **Prisma ORM**, **Cloudinary** |

---

## 🎨 Design System & Color Palette

Designed specifically as a clean, highly legible bakery management dashboard:

- 🌸 **Primary Accent (Bakery Pink)**: `#E07A5F`, `#FDF0EE`, `#F4B4BA`
- 🍫 **Secondary Text & Headers (Warm Cocoa Brown)**: `#3D2314`, `#7C685C`, `#9C8A7E`
- 🥐 **Background & Surface**: `#FAF6F0` (Soft Cream Background), `#FFFDF9` (Input Surface)
- 📐 **Typography & Layout**: Generous whitespace, rounded cards (`rounded-2xl`), scannable data grids, and crisp contrast.

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- **Node.js**: `v18.x` or higher
- **npm** or **yarn** / **pnpm**

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hanminthawhmt/cake-shop-owner-dashboard.git
   cd petal-and-cocoa-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
   *(For production build, set `NEXT_PUBLIC_API_URL` to your live NestJS API endpoint)*.

4. **Run the local development server**:
   ```bash
   npm run dev
   ```

5. **Open Application**:
   Navigate to [http://localhost:3001](http://localhost:3001) in your browser.

---

## 📑 Build & Production Scripts

```bash
# Run Next.js development server
npm run dev

# Execute TypeScript type check
npx tsc --noEmit

# Create optimized production build
npm run build

# Start production server
npm run start
```

---

## 🛡️ License

This project is open-source and available under the [MIT License](LICENSE).
