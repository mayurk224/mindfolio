# Mindfolio Client

A modern, fast, and interactive frontend for your Mindfolio second brain.

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Lucide_React-Latest-E34F26?logo=lucide&logoColor=white" alt="Lucide React" />
  <img src="https://img.shields.io/badge/Framer_Motion-Latest-FF0055?logo=framer&logoColor=white" alt="Framer Motion" />
</p>

## Overview

The Mindfolio Client is the user interface for the Mindfolio ecosystem. It provides a visual dashboard where users can view their saved items, organize them with tags, and interact with the AI-extracted summaries. Built with React 19 and Vite, it focuses on performance, accessibility, and a premium aesthetic using modern design patterns.

## Key Features

- **Personal Dashboard**: A central timeline with **Infinite Scroll** to view all saved bookmarks, images, and videos.
- **Masonry Layout**: Dynamic, space-efficient grid representation of your saved content for optimal visibility.
- **Collections Management**: Organize your saved items into custom collections for better categorization and quick access.
- **Trash & Recovery**: Safely delete items with a soft-delete mechanism and recover them from the Trash view if needed.
- **AI Content Extraction**: Real-time display of summarized metadata and key insights extracted by AI.
- **Google OAuth**: Fast and secure authentication with Google for a seamless login experience.
- **Interactive UI**: Smooth animations with Framer Motion and a responsive design powered by Tailwind CSS 4.
- **Real-time Notifications**: Instant feedback on saving operations via Sonner toasts and Socket.io.

## Architecture & Structure

```text
client/
├── src/
│   ├── components/       # UI components (Button, Input, Sidebar, etc.)
│   │   ├── ui/           # Shadcn/ui atomic components
│   ├── pages/            # Page-level components (Home, Auth, Trash)
│   ├── lib/              # Library configurations (utils, api)
│   ├── hooks/            # Custom React hooks
│   ├── context/          # State management context
│   └── App.jsx           # Main application entry point
├── public/               # Static assets
└── index.html            # Main HTML file
```

## Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **npm** or **yarn**

### Installation

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file from the example:
   ```bash
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_API_URL=http://localhost:8000/api
   ```

### Running the App

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_GOOGLE_CLIENT_ID` | Your Google Cloud Console Client ID for OAuth. |
| `VITE_API_URL` | The endpoint for your Mindfolio backend server. |
