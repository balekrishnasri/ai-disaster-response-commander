# AI Disaster Response Commander

A full-stack disaster-monitoring and rescue-coordination command center. The public dashboard combines OpenStreetMap, active alerts, nearby shelters, live Open-Meteo weather, and a local AI-style risk score. Authenticated citizens can request and track rescue help while responders receive, assign, and update requests in real time.
    
## Stack:

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6
- **Maps:** Leaflet + React Leaflet with OpenStreetMap tiles
- **Realtime:** Socket.IO client/server
- **Backend:** Node.js, Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT and mocked phone OTP
- **Weather:** Open-Meteo

## Project structure

```text
ai-disaster-response-commander/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/{common,map,dashboard,auth,rescue}/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── routes/
│   └── package.json
├── backend/
│   ├── config/db.js
│   ├── server.js
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── sockets/
│   │   └── seed.js
│   └── package.json
└── package.json
```

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB running locally, or a MongoDB Atlas connection string

## Local setup

1. Install root tooling and both application workspaces:

   ```bash
   npm install
   npm run install:all
   ```

2. Create local environment files:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. Set a strong `JWT_SECRET` and your MongoDB connection in `backend/.env`.

   Open-Meteo's free public endpoint does not require a key. `OPEN_METEO_API_KEY` is supported as an optional environment variable for plans/endpoints that require one.

4. Start MongoDB, then seed local demo data:

   ```bash
   npm run seed
   ```

5. Start frontend and backend together:

   ```bash
   npm run dev
   ```

The frontend runs at `http://localhost:5173` and the API/Socket.IO server runs at `http://localhost:5000`.

## Development authentication

1. Open **Emergency Login**.
2. Choose **Citizen** or **Responder**.
3. Enter any valid-looking phone number and request an OTP.
4. The generated OTP is printed in the backend console.
5. While `NODE_ENV=development`, any six-digit code is accepted.

`ALLOW_DEV_ROLE_SELECTION=true` allows the login UI to create/switch local users between citizen and responder roles. Disable it outside local development. The seed also creates responder phone `+15550000001`.

## Main routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Welcome and primary calls to action |
| `/dashboard` | Public | Map, alerts, shelters, weather, and AI risk |
| `/login` | Public | Phone and OTP login |
| `/rescue-portal` | Citizen | Submit a rescue request |
| `/track/:requestId` | Request owner | Live rescue tracking |
| `/team/dashboard` | Responder/admin | Dispatch, assignment, and status updates |

## API

All REST endpoints are prefixed with `/api`.

- `POST /auth/send-otp`, `POST /auth/verify-otp`, `GET /auth/me`
- `GET /shelters`, `GET /shelters/nearby?lat&lng`
- `GET /alerts`
- `GET /weather/risk?lat&lng`
- `POST /rescue`, `GET /rescue/:id`, `GET /rescue`
- `PATCH /rescue/:id/assign`, `PATCH /rescue/:id/status`
- `GET /teams`, `GET /teams/available`

## Realtime events

- `new_rescue_request`
- `request_assigned`
- `status_update`
- `team_location_update`

Authenticated sockets join a user-specific room. Responder and admin sockets also join the shared responder dispatch room.

## Scripts

```bash
npm run dev          # Run API and Vite concurrently
npm run build        # Build the frontend
npm run lint         # Lint backend and frontend
npm run seed         # Reset and seed shelters, alerts, and teams
npm start            # Start the backend in production mode
```

## Risk scoring

`backend/src/services/aiRisk.service.js` computes a deterministic 0–100 regional score from:

- current rainfall (up to 45 points),
- current wind speed (up to 35 points),
- proximity to a hardcoded flood-prone zone (20 points).

This is an explainable demonstration heuristic, not a replacement for official emergency guidance.
