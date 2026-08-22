# GlobeTrotter

GlobeTrotter is a premium, personalized travel planning platform. It allows users to create multi-city itineraries, manage dates and activities, explore destinations, estimate trip costs, visualize plans on an interactive 3D globe, and collaborate with friends.

## Project Structure

This repository is organized as a monorepo containing both the frontend and backend of the application:

- `/frontend` - The Next.js 14+ (App Router) web application. Built with TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, and React Three Fiber for a premium, cinematic user experience.
- `/backend` - The backend service supporting the GlobeTrotter platform.

## Getting Started

To run the project locally, you will need to set up both the frontend and backend. 

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (copy `.env.example` to `.env.local` and fill in values).
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

For more details on the frontend architecture and available commands, see the [Frontend README](./frontend/README.md).

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Follow the specific backend setup instructions in the [Backend README](./backend/README.md).
