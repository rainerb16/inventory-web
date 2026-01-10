# Inventory Dashboard – Frontend

A React frontend for an inventory dashboard that uses **session-based authentication** with a Node/Express backend.  
The app relies on **HttpOnly cookies** and a `/me` endpoint to determine authentication state.

This project is intentionally simple and focused on **correct auth flow and frontend ↔ backend responsibility separation**, not UI complexity.

Also set up GitHub Actions CI to automatically install dependencies and run frontend build + backend checks on every push/ PR.

---

## Tech Stack
- React (Vite)
- JavaScript (ES6+)
- Sass (SCSS)
- Fetch API
- Session-based auth (via backend)

---

## Key Concepts Demonstrated

### Session-Based Authentication (Frontend Side)
- The frontend does **not** store auth state in localStorage or memory.
- On page load, the app calls `GET /me` to ask the backend who is logged in.
- Authentication state is derived entirely from backend responses.

### Cookie-Based Login
- Session cookies are sent automatically by the browser.
- All API requests use `credentials: "include"` so cookies are sent with requests.
- The frontend never manually reads or writes cookies.

### `/me` Pattern
- `/me` is the single source of truth for auth state.
- Used on initial load and refresh to determine whether the user is logged in.
- Prevents UI flicker and incorrect auth assumptions.

### Protected Data Flow
- UI only attempts to fetch protected resources (e.g. `/items`) after auth is confirmed.
- Backend enforces authorization — frontend checks are only for UX.

---

## Project Structure

src/
  api.js # Centralized API helper (cookies, errors, JSON)
  App.jsx # Auth flow + conditional UI
  main.jsx # App bootstrap
  - styles/
      app.scss # Global Sass styles 


---

## API Helper (`api.js`)
All network requests go through a single helper function:

- Automatically prefixes API base URL
- Always sends cookies (`credentials: "include"`)
- Centralizes JSON parsing and error handling

---

## Auth Flow (Frontend Perspective)

1. App loads
2. `GET /me` is called
3. If user exists → show authenticated UI
4. If user is null → show login/signup
5. Login/signup updates backend session
6. Frontend updates UI based on backend response

At no point does the frontend “decide” auth state on its own.

---

## Styling
- Sass (SCSS) for styling
- Simple utility-style class names
- Focused on clarity and maintainability over visual polish

---

## Running Locally

### Prerequisites
- Backend running at `http://localhost:3000`
- Node.js installed

### Install & Run
```bash
npm install
npm run dev
```

### Frontend runs at:
`http://localhost:5173`

## Todo / Next Steps

X DONE – Add items UI (list, create, update, delete)
X DONE – Persist user session across tabs and refresh
X DONE – Add loading and empty states for item data
X DONE - Extract UI into reusable components
- Improve form validation and user feedback
- Add basic routing (auth vs dashboard views)
- Improve accessibility and keyboard navigation
- Prepare production build and environment configuration
