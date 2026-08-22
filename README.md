# GlobeTrotter

GlobeTrotter is a comprehensive, AI-powered travel planning and intelligence platform designed to seamlessly handle everything from initial destination discovery to granular day-to-day itinerary management.

## Features

- **Intelligent Trip Planning**: Plan trips with multiple destinations, set budgets, define traveler counts, and track detailed logistics.
- **AI Travel Copilot**: A context-aware, server-side AI assistant that can analyze your itinerary, suggest changes, and explain budget conflicts, all while requiring strict user confirmation for any destructive actions.
- **Personalized Travel Intelligence**: GlobeTrotter learns from your travel history (e.g. added activities, explicit preferences) to infer your Travel Style (Culture, Adventure, etc.) and Preferred Pace, influencing future recommendations.
- **Smart Recommendations**: A robust recommendation engine that scores places and activities based on trip constraints, budget boundaries, and personalized travel profiles.
- **Logistics & Budget Management**: Track accommodations, transportation, and precise budget breakdowns (planned vs. actual).
- **Security First**: Strict isolation between user accounts, server-side-only AI key management, and robust authentication guards.

## Architecture & Technology Stack

The application uses a modern monorepo structure separating the frontend and backend.

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query) + Context API
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend
- **Framework**: Next.js API Routes (Serverless)
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: JWT based custom authentication
- **AI Integration**: Vercel AI SDK (`ai`, `@ai-sdk/google`) with Google Gemini (`gemini-2.5-flash`)

## Setup & Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Environment Variables
Create a `.env` file in both the `frontend/` and `backend/` directories. Use `.env.example` as a template.

**Backend (`backend/.env`)**
```env
# Ensure you provide a valid Gemini API key for the AI Copilot to function
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_here
```

**Frontend (`frontend/.env`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 2. Database Setup & Seeding
Navigate to the `backend` directory and set up the SQLite database:
```bash
cd backend
npx prisma generate
npx prisma db push
npm run seed
```

### 3. Running the Application
Start both the frontend and backend development servers.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

## Testing & Production Build

### Building for Production
To verify the application compiles correctly, run the production builds:
```bash
cd backend && npm run build
cd ../frontend && npm run build
```

### TypeScript Validation
```bash
npx tsc --noEmit
```

## Deployment Readiness

GlobeTrotter is designed to be easily deployable to Vercel or any standard Node.js hosting environment.
- The SQLite database (`dev.db`) is currently used for local persistence. For production deployment on edge networks, you should migrate the Prisma provider to `postgresql`.
- Ensure all environment variables (especially `JWT_SECRET` and `GOOGLE_GENERATIVE_AI_API_KEY`) are securely set in your hosting provider's dashboard. Never commit these secrets to version control.
