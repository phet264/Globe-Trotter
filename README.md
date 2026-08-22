# GlobeTrotter 🌍✈️

GlobeTrotter is a premium, interactive travel planning application designed to make building itineraries, tracking budgets, and visualizing journeys a seamless and delightful experience.

## Features

- **Interactive 3D Globe & Maps**: Visualize your upcoming trips with an interactive 3D globe and precise Mapbox integration.
- **Cinematic Journey Mode**: Replay your trip itinerary with cinematic 3D travel transitions (Airplane, Bus, Walking).
- **Drag-and-Drop Itinerary Builder**: Easily arrange your daily activities and travel stops.
- **Real-time Budget Tracking**: Monitor your expenses, view daily averages, and track category breakdowns.
- **Trip Sharing**: Generate public links to share your itineraries with friends and family without exposing private budget details.
- **Responsive & Accessible**: Optimized for mobile and desktop screens, adhering to accessibility standards with reduced motion fallbacks.

## Architecture & Tech Stack

**Frontend**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- React-Three-Fiber & Drei (3D Rendering)
- Zustand (State Management)
- Lucide React (Icons)

**Backend**
- Next.js (API Routes)
- Prisma ORM
- PostgreSQL (Managed Database)
- NextAuth.js (Authentication)
- Zod (Validation)

## Setup & Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- PostgreSQL Database

### Installation

1. Clone the repository and install dependencies in both `frontend` and `backend` directories.
```bash
cd backend && npm install
cd ../frontend && npm install
```

2. Set up environment variables based on the `.env.example` files provided in both directories.
```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

3. Initialize the Database
```bash
cd backend
npx prisma db push
npx prisma db seed
```

4. Start the development servers
```bash
# In the backend directory
npm run dev -- -p 3001

# In the frontend directory
npm run dev -- -p 3000
```
Open `http://localhost:3000` to view the application.

## Testing & Validation

Run the following commands to validate the build:
```bash
npm run lint       # Run ESLint validation
npm run typecheck  # Run TypeScript compiler checks
npm test           # Run automated test suites
npm run build      # Validate production build
```

## Deployment

The application is configured to be deployed on **Vercel** with a managed PostgreSQL instance (e.g., Supabase or Neon). 

1. Connect your GitHub repository to Vercel.
2. Set the Root Directory to `frontend`.
3. Add the required environment variables to the Vercel dashboard.
4. (Optional) Deploy the backend as a separate service or utilize Next.js full-stack capabilities by merging the directories.

## Troubleshooting

- **Next.js 16 Routing**: If you encounter 404 errors on dynamic routes (e.g., `/trips/[id]`), ensure you are awaiting `params` as required by the Next.js 16+ breaking changes.
- **3D Performance**: On lower-end devices, the application will automatically fallback to a 2D map or reduced motion state. Ensure WebGL is enabled in your browser.
