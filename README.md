# Tasmania Trek Planner 🏔️

A comprehensive web application to help plan and train for the Three Capes Track trek in Tasmania.

## Features

- **Tasks & Bookings**: Track group tasks like accommodation bookings, permits, and other preparations. Each person can mark tasks as completed.
- **Flights**: Manage flight information and track which group members are on each flight.
- **Packing List**: Shared packing checklist organized by categories (Clothing, Gear, Food & Water, etc.). Each person can mark items they've packed.
- **Chat**: Group chat to communicate and coordinate with your trekking buddies.
- **Training Tracker**: Set personal training goals and log activities (hikes, runs, gym sessions) with stats tracking.

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How It Works

All data is stored in your browser's localStorage, so:
- Your data persists across sessions
- Each person uses the same website but enters their own name
- Data stays on your device (no backend server needed)
- To share updates, you'll need to coordinate manually or use the chat feature

## Usage Tips

1. **First Time Setup**: When you open the app, start by adding tasks, flights, and packing list items.
2. **Personal Features**: For Chat and Training, you'll be prompted to enter your name. This name is remembered for future visits.
3. **Team Coordination**: Share the website URL with your trek mates so everyone can access the same planning tools on their devices.
4. **Data Backup**: Since data is stored locally, consider taking screenshots or exporting important information periodically.

## Tech Stack

- React 18
- Vite
- CSS3 (Custom styling with CSS variables)
- localStorage for data persistence

## Three Capes Track

The Three Capes Track is a 46km, 4-day/3-night independent walking experience on the Tasman Peninsula, Tasmania. It showcases dramatic coastal scenery, including Cape Pillar, Cape Hauy, and Cape Raoul.

Good luck with your training and have an amazing trek! 🥾
