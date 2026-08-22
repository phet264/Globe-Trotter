# 🌍 GlobeTrotter

> **Plan smarter. Travel better. Experience more.**

GlobeTrotter is a premium, interactive travel planning platform designed to make trip planning simple, visual, intelligent, and enjoyable.

It combines itinerary planning, interactive maps and 3D visualization, budget tracking, personalized recommendations, AI assistance, and trip sharing into a single travel experience.

---

## ✨ Features

### 🗺️ Interactive Trip Planning

Create complete travel plans with:

- Trip title and description
- Country and destination selection
- Travel dates
- Multiple cities and destinations
- Activities
- Accommodation
- Transportation
- Trip preferences
- Budget planning

All trip information is organized into a centralized itinerary.

---

### 🧭 Drag-and-Drop Itinerary Builder

Build and reorganize itineraries visually.

Users can:

- Add activities to specific days
- Reorder activities
- Move activities between itinerary positions
- Organize daily schedules
- Quickly modify planned activities

---

### 🌐 Interactive 3D Globe & Maps

Explore trips visually using an interactive 3D globe and maps.

GlobeTrotter uses:

- React Three Fiber
- Drei
- Mapbox

to provide an immersive geographic experience.

Users can visualize destinations and journeys instead of relying only on traditional lists.

---

### 🎬 Cinematic Journey Mode

Experience your itinerary through cinematic travel transitions.

Supported transportation experiences include:

- ✈️ Airplane
- 🚌 Bus
- 🚶 Walking

The application also provides reduced-motion and fallback experiences for accessibility and lower-end devices.

---

### 💰 Real-Time Budget Tracking

Monitor the financial side of a trip from one place.

GlobeTrotter provides:

- Total trip budget
- Planned expenses
- Remaining budget
- Daily average spending
- Category breakdowns
- Budget monitoring
- Spending visualization
- Budget warnings

This helps travelers understand how their planned spending is distributed throughout the trip.

---

### 🤖 AI Travel Copilot

GlobeTrotter includes an AI-powered Travel Copilot designed to assist with trip planning.

The AI can help with:

- Itinerary questions
- Trip planning
- Recommendations
- Budget-related questions
- Travel decisions
- Itinerary modifications
- Trip optimization

AI actions work through the application's existing services rather than providing unrestricted database access.

---

### 🧠 Travel Intelligence & Personalization

GlobeTrotter can learn from travel-related preferences and behavior to provide more relevant recommendations.

The personalization system can consider:

- Explicit travel preferences
- Previous trips
- Selected activities
- Saved destinations
- Travel categories
- Travel pace
- Budget behavior
- Travel style

Possible travel-style dimensions include:

- Culture Explorer
- Food Lover
- Nature Traveler
- Adventure Seeker
- Relaxed Traveler
- Urban Explorer

New users can still use the recommendation system without historical travel data.

---

### 🎯 Personalized Recommendations

Recommendations can combine:

Current Trip  
+ Current Preferences  
+ Travel History  
+ Traveler Profile  
+ Budget  
= Personalized Recommendations

The personalization system becomes more useful as the user builds additional travel history.

---

### 📊 Travel Insights

GlobeTrotter can provide insights based on accumulated travel behavior.

Examples include:

- Favorite travel categories
- Typical trip duration
- Preferred travel pace
- Frequently selected activities
- Travel style
- Cross-trip patterns

Users can distinguish between explicitly selected preferences and learned travel patterns.

---

### 📤 Trip Sharing

Users can generate public links for sharing itineraries.

Public itineraries are designed to allow others to view useful trip information without exposing private budget information.

Trip sharing can be used to:

- Share trips with friends
- Share itineraries with family
- Present travel plans
- Allow others to view a planned journey

Private user information and private budget information remain protected.

---

### 📱 Responsive & Accessible

GlobeTrotter is designed for:

- Desktop
- Tablet
- Mobile

The interface includes accessibility considerations such as:

- Keyboard-friendly interactions
- Accessible controls
- Clear focus states
- Reduced-motion alternatives
- Responsive layouts

The 3D experience can fall back to a simpler experience when WebGL or intensive rendering is unsuitable.

---
# 🏗️ Architecture

GlobeTrotter follows a full-stack architecture where the frontend communicates with backend services and persistent database storage.

## Application Flow

Frontend
↓
Next.js API Routes
↓
Application Services
↓
Prisma ORM
↓
PostgreSQL

AI-powered features use the same application services and authorization layer instead of accessing the database directly.

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| Next.js 16 | Application framework |
| React 19 | UI architecture |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| React Three Fiber | 3D rendering |
| Drei | 3D utilities |
| Zustand | Client-side state management |
| Lucide React | Icons |

## Backend

| Technology | Purpose |
|---|---|
| Next.js API Routes | Backend/API layer |
| Prisma | ORM and database access |
| PostgreSQL | Persistent database |
| NextAuth.js | Authentication |
| Zod | Input validation |

## Maps & Visualization

| Technology | Purpose |
|---|---|
| Mapbox | Maps and geographic visualization |
| React Three Fiber | Interactive 3D globe |
| Drei | 3D scene utilities |

---

# 📁 Project Structure

The project is organized into frontend and backend application areas.

Typical structure:

GlobeTrotter/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── store/
│   └── ...
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.*
│   │
│   ├── app/
│   ├── api/
│   └── ...
│
├── README.md
└── ...

> The exact directory structure may vary depending on the current implementation.

---
# 🔐 Authentication & Security

GlobeTrotter uses authenticated user accounts and persistent database storage.

Authentication is handled using:

**NextAuth.js**

User-owned data is protected through authenticated access and authorization checks.

Private user data includes:

- Trips
- Itineraries
- Activities
- Budgets
- Accommodation
- Transportation
- Preparation
- Travel profiles
- AI conversations

Sensitive credentials and API keys must be stored using environment variables and must never be committed to the repository.

---

# 🗄️ Database

GlobeTrotter uses:

**PostgreSQL + Prisma**

The database stores persistent application data such as:

- Users
- Countries
- Destinations
- Places
- Trips
- Itineraries
- Activities
- Accommodation
- Transportation
- Budgets
- Preferences
- Travel behavior
- Travel profiles
- AI-related data

The database is the source of truth for persistent user data.

---

# ⚙️ Getting Started

## Prerequisites

Make sure the following are installed:

- Node.js 18+
- npm or pnpm
- PostgreSQL
- Git

You will also need the required API credentials described in the environment configuration.

---

## 1. Clone the Repository

    git clone <YOUR_REPOSITORY_URL>
    cd GlobeTrotter

---

## 2. Install Dependencies

If the project maintains separate frontend and backend directories:

    cd backend
    npm install

    cd ../frontend
    npm install

---

## 3. Configure Environment Variables

Create the required environment files:

    cp frontend/.env.example frontend/.env.local
    cp backend/.env.example backend/.env

Fill in the required values.

Example configuration:

    DATABASE_URL=

    NEXTAUTH_SECRET=
    NEXTAUTH_URL=

    MAPBOX_ACCESS_TOKEN=

    AI_API_KEY=

> Never commit `.env`, `.env.local`, API keys, database credentials, or other secrets.

---

# 🗃️ Database Setup

From the backend directory:

    cd backend

Apply the Prisma schema:

    npx prisma db push

Run the database seed:

    npx prisma db seed

For production environments, use the project's migration workflow rather than relying on `db push`.

---

# ▶️ Running Locally

## Backend

From the backend directory:

    npm run dev -- -p 3001

## Frontend

From the frontend directory:

    npm run dev -- -p 3000

Open:

    http://localhost:3000

---