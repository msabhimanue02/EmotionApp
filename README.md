# EmotionApp

Full‑stack emotion feedback app with a Flask backend (Python) and a React frontend. Users can sign up, sign in, submit feedback with a rating (1–5), and see a predicted sentiment. Admins can log in to view all feedback on a read‑only dashboard.

## Features
- User signup/signin with email + password
- Feedback submission with rating 1–5
- Sentiment prediction shown in a centered modal
- Admin login (admin/admin123) to view all feedback
- Read‑only Admin Dashboard (no delete actions in UI)

## Tech Stack
- Backend: Flask, SQLite, scikit‑learn, pandas
- Frontend: React (Create React App)

## Prerequisites
- Python 3.11/3.12
- Node.js 18+

Notes:
- The first run reads `EmotionDetection.csv`, trains a simple model, and creates `database.db` with tables: `users`, `feedback`.
- If you ever need a fresh DB: stop the server and delete `backend/database.db`. It will be recreated automatically on next start.

## Usage
- Sign Up using a username, email, password
- Sign In using email + password
- Submit Feedback with rating (1–5)
- See predicted sentiment in a modal
- Admin login: username `admin`, password `admin123`
- Admin Dashboard: read‑only table of all feedback, with Logout at top‑right

## API (selected)
- POST `/signup` — body: `{ username, email, password }`
- POST `/signin` — body: `{ email, password }`
- POST `/feedback` — body: `{ user_id, comment, rating }` (rating 1–5)
- GET `/feedback` — list all feedback (used by Admin Dashboard)
- POST `/admin` — body: `{ username, password }` → returns all feedback if admin creds are valid







