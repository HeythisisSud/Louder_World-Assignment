# 🌏 Sydney Events Platform — Intern Assignment Submission

A full-stack event discovery platform that automatically scrapes live Sydney events from public sources, stores them in a database, and displays them in a clean modern UI with admin review + import workflows.

This project demonstrates an end-to-end production-ready pipeline:

✅ Scrape → Store → Display → Review → Import → Tag Updates  
✅ MERN-style fullstack with PostgreSQL + Prisma + Next.js + Express  
✅ Google OAuth Authentication + Admin Dashboard  
✅ Ticket Click Tracking + Email Consent Storage  
✅ Redis Caching via Upstash for scalable performance  

---

## 🚀 Features

### ✅ Event Scraping + Auto Updates
- Automatically scrapes Sydney events from multiple public sources (Eventbrite implemented).
- Extracts key event information:
  - Title
  - Date & Time
  - Venue name + suburb/address
  - Category tags
  - Organizer name
  - Price
  - Event image/poster URL
  - Source site name + original event URL
  - Last scraped timestamp

- Handles dynamic Eventbrite rendering using Puppeteer + Cheerio.
- Detects:
  - New events
  - Updated events
  - Inactive/expired events

---

### ✅ Minimal Event Listing Website
Public event feed displaying Sydney events in a modern UI:

Each Event Card shows:
- Event name
- Human-readable datetime
- Venue + suburb
- Organizer
- Source website
- Price
- “Get Tickets” CTA

---

### ✅ Ticket Click Popup + Consent Capture
Clicking **GET TICKETS**:

✅ Opens modal popup  
✅ Requests email address  
✅ Optional consent checkbox  
✅ Saves email + consent + event reference to database  
✅ Redirects to original ticket website

---

### ✅ Google OAuth Login + Dashboard Protection
- Google Sign-in via Passport.js
- Only authenticated users can access dashboard routes
- Session-based authentication with cookies

---

### ✅ Admin Dashboard Workflow (Assignment Requirement)
Dashboard includes:

✅ Filters  
- City filter (Sydney default; scalable multi-city)  
- Keyword search  
- Date range filter  

✅ Views  
- Table view of events  
- Preview panel for full event details  

✅ Actions  
- “Import to Platform” button per event  
- Stores:
  - imported status
  - importedAt timestamp
  - importedBy user
  - optional importNotes

✅ Status Tags  
Events include state labels:

- `new`
- `updated`
- `inactive`
- `imported`

---

### ✅ Redis Caching (Upstash Integration)
Event listing API uses Redis caching for performance:

- Paginated event results cached with TTL
- Cache automatically cleared after scraping refresh

Powered by **Upstash Redis** (production-ready serverless caching)

---

---

## 🛠 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- TailwindCSS
- Modern glassmorphic UI components

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM

### Database
- PostgreSQL (hosted)

### Scraping
- Puppeteer (dynamic rendering)
- Cheerio (HTML parsing)

### Authentication
- Passport.js
- Google OAuth 2.0
- Express Sessions

### Caching
- Redis via Upstash

---

---

