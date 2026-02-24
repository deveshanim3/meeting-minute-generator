# MeetMind Backend

## Setup

1. Copy `.env.example` to `.env`
2. Update `MONGODB_URI` and `JWT_SECRET`
3. Run:

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` - Run with nodemon
- `npm run start` - Run in production mode
- `npm run lint` - Lint project files

## Base API

- `GET /api/v1/health` - Service health check
