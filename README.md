# Inventory Management Dashboard (Frontend)

A React-based interface designed for high-performance inventory tracking. This project serves as a "Merchant-First" dashboard, prioritizing a secure **Session-Based Authentication** flow and a clear separation of concerns between the UI and the API.

## Project Philosophy
This isn't just a UI; it's a demonstration of **Technical Integrity**. I built this to prove that a frontend can be simple, secure, and resilient by deferring all state authority to the backend—ensuring the merchant's data is never compromised.

## Technical Stack
- **Framework:** React (Vite for optimized builds)
- **Styling:** Sass (SCSS) for modular, maintainable UI components
- **Communication:** Fetch API with centralized error handling
- **DevOps:** GitHub Actions CI for automated build verification and dependency auditing

---

## Core Concepts: The "Security-First" Approach

### 1. The `/me` Source of Truth
Instead of storing sensitive auth data in `localStorage`, this app uses the **`/me` pattern**. On every page load, the frontend asks the backend for the current session. This eliminates "UI flicker" and ensures the user only sees what they are authorized to see.

### 2. Cookie-Based Data Integrity
- **Zero-Touch Cookies:** The frontend never reads or writes cookies manually. 
- **Automated Security:** All requests utilize `credentials: "include"`, allowing the browser to handle **HttpOnly cookies** securely.
- **Responsibility Separation:** The backend enforces the rules; the frontend provides the best possible experience based on those rules.

---

## System Architecture

### Centralized API Helper (`api.js`)
I abstracted all network logic into a single helper to ensure:
- **Consistency:** Global API prefixing and standard JSON parsing.
- **Resilience:** Centralized error handling for network failures or unauthorized attempts.
- **Scalability:** Makes switching environments (Dev vs. Production) a single-line change.

### Project Structure
```text
src/
 ├── api.js        # Centralized Fetch logic & Cookie management
 ├── App.jsx       # Global Auth state & Conditional UI logic
 ├── main.jsx      # Application entry point
 └── styles/       # Modular SCSS architecture
```

## Merchant Workflow (Auth Flow)
1. Initialization: App polls `GET /me`.

2. Context Awareness: If a session exists, the Merchant Dashboard is rendered.

3. Seamless Login: If no session is found, the user is guided to a clean Login/Signup view.

4. Data Protection: Protected resources (like `/items`) are only fetched after the backend confirms the identity.

## Local Development
**Prerequisites**
- Node.js installed.
- Inventory API running locally at`http://localhost:3000`.

**Setup**
```bash
# Install dependencies
npm install

# Launch the development server
npm run dev
```
*The dashboard will be accessible at `http://localhost:5173`.*

