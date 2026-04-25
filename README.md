# GameLoop — PS5 Game Rental Subscription Service

A full-stack web application for renting physical PlayStation 5 game CDs on a monthly subscription basis. Built as a university Final Year Project.

**Live demo:** (add your Render URLs after deployment)

---

## Features

- 🔐 JWT authentication (signup, login, role-based access)
- 🎮 Game catalog with search, genre filter, and pagination
- 💳 3 subscription plans (Basic / Standard / Premium)
- 📦 Rental system (rent / return, slot tracking, availability)
- 💰 Manual payment flow (NayaPay / EasyPaisa / bank) with screenshot upload
- 👑 Full admin panel (users, games, subscriptions, rentals, payments, stats)
- 📧 Email notifications (welcome, payment approved/rejected, rental confirmed)
- 🌙 Dark PS5-style UI with responsive design
- ⚠️ Late return warnings
- 📄 FAQ, Terms, Return Policy, Contact pages

---

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Axios
**Backend:** Node.js, Express, Mongoose, JWT, Bcrypt, Multer, Nodemailer
**Database:** MongoDB Atlas (free tier)
**Uploads:** Cloudinary (free tier) — persistent across deploys
**Deployment:** Render (backend Web Service + frontend Static Site)

---

## Project Structure

```
Gaming-Rental-Store/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Shared UI components
│   │   ├── pages/          # Route pages
│   │   │   └── admin/      # Admin-only pages
│   │   ├── context/        # Auth context
│   │   ├── services/       # Axios instance
│   │   └── hooks/          # Custom hooks (useApi)
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── config/             # DB + Cloudinary setup
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth, admin, upload, errors
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   ├── utils/              # Plans, email helpers
│   ├── seed.js             # Sample data seeder
│   └── server.js           # Entry point
├── render.yaml             # Render infrastructure config
└── README.md
```

---

## Local Setup

### Prerequisites
- Node.js 18+ and npm
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account
- A free [Cloudinary](https://cloudinary.com/users/register_free) account
- (Optional) A Gmail account with [App Password](https://myaccount.google.com/apppasswords) for real email sending

### 1. Clone & install

```bash
git clone <your-repo-url>
cd Gaming-Rental-Store

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure environment

**Backend** (`server/.env`) — copy from `.env.example`:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/gameloop
JWT_SECRET=<long-random-string>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=<your-cloud>
CLOUDINARY_API_KEY=<your-key>
CLOUDINARY_API_SECRET=<your-secret>

# Leave blank to mock (logs to console)
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM="GameLoop <no-reply@gameloop.com>"

ADMIN_EMAIL=mujahidabdullah54@gmail.com
ADMIN_PASSWORD=abdullaH1150
```

**Frontend** (`client/.env`):

```
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the database

From `server/`:

```bash
npm run seed
```

This creates:
- Admin user — `mujahidabdullah54@gmail.com` / `abdullaH1150`
- Test user — `user@gameloop.com` / `user123`
- 5 sample PS5 games

### 4. Run dev servers

**Terminal 1** — backend:
```bash
cd server
npm run dev
```

**Terminal 2** — frontend:
```bash
cd client
npm run dev
```

Open http://localhost:5173

---

## Deploying to Render

### Step 1 — MongoDB Atlas

1. Go to https://cloud.mongodb.com, create a free M0 cluster.
2. Create a database user (Database Access).
3. **Network Access → Add IP → `0.0.0.0/0`** (Render IPs are dynamic; lock this down in production).
4. Connect → Drivers → copy the connection string.

### Step 2 — Cloudinary

1. Sign up at https://cloudinary.com.
2. From your dashboard, copy: **Cloud name**, **API Key**, **API Secret**.

### Step 3 — Gmail App Password (optional, for real email)

1. Enable 2FA on your Gmail account.
2. Go to https://myaccount.google.com/apppasswords → create app password → copy it.
3. Use your Gmail address for `EMAIL_USER` and the app password for `EMAIL_PASS`.

### Step 4 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-url>
git push -u origin main
```

### Step 5 — Deploy to Render

**Option A — One-click with `render.yaml`:**

1. Go to https://dashboard.render.com → **New → Blueprint**.
2. Connect your GitHub repo.
3. Render detects `render.yaml` and prompts for the `sync: false` env vars. Fill them in:
   - `MONGO_URI` — from Atlas
   - `JWT_SECRET` — any long random string
   - `CLIENT_URL` — placeholder, we'll update it after the frontend deploys
   - `CLOUDINARY_*` — from Cloudinary dashboard
   - `EMAIL_USER` / `EMAIL_PASS` — optional
   - `VITE_API_URL` — placeholder, we'll update after the backend deploys

**Option B — Manual:**

Create two services:

**Backend (Web Service):**
- Root Directory: `server`
- Build: `npm install`
- Start: `npm start`
- Environment: Node
- Env vars: all backend vars above

**Frontend (Static Site):**
- Root Directory: `client`
- Build: `npm install && npm run build`
- Publish Directory: `dist`
- Env var: `VITE_API_URL=<your-backend-url>/api`
- Rewrite rule: `/* → /index.html` (for React Router)

### Step 6 — Wire them together

After both services deploy:
1. Copy the frontend URL (e.g. `https://gameloop-client.onrender.com`) → set it as `CLIENT_URL` on the backend service.
2. Copy the backend URL (e.g. `https://gameloop-api.onrender.com`) → set `VITE_API_URL=https://gameloop-api.onrender.com/api` on the frontend service.
3. Redeploy both.

### Step 7 — Seed the production DB

Render's free tier doesn't ship with a shell for one-off commands. Easiest option: run the seed script locally **pointed at your Atlas URI**:

```bash
cd server
# Edit .env to use the production MONGO_URI
npm run seed
```

### Cold starts

Render's free Web Service spins down after 15 min of inactivity. The first request after idle takes ~30–60 seconds. The frontend shows a "Waking up the server…" splash so examiners don't think the app is broken.

---

## API Reference

Base URL: `/api`

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | `{ name, email, password }` |
| POST | `/auth/login` | `{ email, password }` |
| GET  | `/auth/me` | Current user (JWT required) |

### Games
| Method | Path | Description |
|---|---|---|
| GET    | `/games?search=&genre=&page=&limit=` | List games |
| GET    | `/games/:id` | Get one |
| POST   | `/games` | Create (admin, multipart with `image`) |
| PUT    | `/games/:id` | Update (admin) |
| DELETE | `/games/:id` | Delete (admin) |

### Subscriptions
| Method | Path | Description |
|---|---|---|
| GET  | `/subscriptions/plans` | Plan definitions |
| POST | `/subscriptions` | `{ plan }` — creates pending subscription |
| GET  | `/subscriptions/current` | Active/pending sub + slot count |
| GET  | `/subscriptions/mine` | All user's subscriptions |

### Rentals
| Method | Path | Description |
|---|---|---|
| POST | `/rentals/rent` | `{ gameId }` |
| POST | `/rentals/return` | `{ rentalId }` |
| GET  | `/rentals/mine` | Current user's rentals |

### Payments
| Method | Path | Description |
|---|---|---|
| POST | `/payments` | Multipart: `subscriptionId`, `method`, `amount`, `screenshot` file |
| GET  | `/payments/mine` | User's payment history |
| PUT  | `/payments/:id` | Admin: `{ status, rejectionReason }` |

### Admin
| Method | Path | Description |
|---|---|---|
| GET | `/admin/stats` | Dashboard counts + revenue |
| GET | `/admin/users` | All users |
| GET | `/admin/subscriptions` | All subs with user + payment |
| GET | `/admin/rentals` | All rentals with late flag |
| GET | `/admin/payments` | All payments |

---

## Database Schema

**User** — `name, email, password (bcrypt), role (user|admin)`
**Game** — `title, genre, description, image, imagePublicId, available, rentedBy`
**Subscription** — `user, plan, gameLimit, price, startDate, endDate, status, payment`
**Rental** — `user, game, subscription, rentedAt, returnDeadline, returnedAt, status`
**Payment** — `user, subscription, amount, method, screenshot, transactionId, status, reviewedBy, rejectionReason`

All timestamps auto-managed via Mongoose `{ timestamps: true }`.

---

## Test Accounts

After seeding:
- **Admin** — `mujahidabdullah54@gmail.com` / `abdullaH1150`
- **User**  — `user@gameloop.com` / `user123`

---

## Notes for Your Supervisor

- **Authentication** uses JWT stored in localStorage. Passwords hashed with bcrypt (10 rounds).
- **Payment flow** is intentionally manual — the goal is to show a full end-to-end workflow (user uploads proof → admin reviews → subscription activates) rather than integrating a real gateway. The `paymentController.review` function is structured so a Stripe/PayPro hook could slot in without touching other code.
- **File uploads** go to Cloudinary, not local disk, because Render's filesystem is ephemeral (free tier wipes on every restart).
- **Email** is optional and falls back to console logging when Gmail SMTP isn't configured.
- **No real-time features** — the frontend polls with `useApi`. For an FYP this is appropriate; a production app might introduce WebSockets for live rental status.

---

## License

MIT — use freely for academic or personal projects.
