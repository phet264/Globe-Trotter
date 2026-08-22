# GlobeTrotter

GlobeTrotter is a personalized travel planning platform for creating multi-city itineraries, managing dates and activities, exploring destinations, estimating trip costs, visualizing plans, and sharing trips with friends through an interactive experience.

## Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Animation**: Framer Motion
- **3D Rendering**: Three.js, React Three Fiber, Drei
- **Forms & Validation**: React Hook Form, Zod
- **Testing**: Vitest, React Testing Library

## Folder Structure

```
app/          # Next.js App router (pages, layouts, loading, error)
components/   # Reusable UI components and domain-specific components
features/     # Feature-based modules (auth, dashboard, destinations, etc.)
lib/          # Shared utilities (api client, animations, three config)
hooks/        # Custom React hooks
schemas/      # Zod validation schemas
types/        # TypeScript type definitions
public/       # Static assets
tests/        # Vitest test files
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Development Commands

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code quality.
- `npm run typecheck`: Validates TypeScript types.
- `npm run test`: Runs unit and component tests with Vitest.

## Environment Setup
Never commit `.env` or `.env.local` files containing real secrets. Use `.env.example` to define required variables for the project.
