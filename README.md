# Mindfolio

A stunning, professional second brain for saving webpages, images, videos, and YouTube links.

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
</p>

## Overview

Mindfolio is an intelligent personal knowledge management system designed to help you capture, organize, and retrieve information seamlessly. Whether it's a deep-dive article, a viral YouTube video, or an inspiring image, Mindfolio extracts the core content and stores it in your "second brain." Powered by AI (LangChain & Mistral), it can summarize content, categorize items, and provide insights, making it more than just a bookmarking tool.

## Key Features

- **Multi-Content Support**: Save webpages, images, videos, and YouTube links with a single click.
- **AI-Powered Extraction**: Automatically extracts summaries and key information from saved links using LangChain and MistralAI.
- **Chrome Extension Integration**: Capture anything directly from your browser with a lightweight, powerful extension.
- **Visual Timeline**: View your saved items in a beautiful, masonry-style layout.
- **Real-time Sync**: Instant updates across your browser and dashboard using Socket.io.
- **Advanced Search & Tags**: Organize your knowledge with a robust tagging system and full-text search.

## Architecture & Structure

```text
mindfolio/
├── client/             # React (Vite) Frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route-level components
│   │   └── utils/      # Client-side utilities
├── server/             # Node.js (Express) Backend
│   ├── models/         # Mongoose schemas
│   ├── controllers/    # Route handlers & logic
│   ├── routes/         # API endpoints
│   └── services/       # Third-party integrations (AI, Storage)
└── chrome-extension/   # Manifest V3 Extension
    ├── background.js   # Service worker
    ├── content.js      # Page content interaction
    └── popup/          # Extension UI
```

## Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: A running instance (local or Atlas)
- **Redis**: Required for background processing (BullMQ)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/mindfolio.git
   cd mindfolio
   ```

2. **Setup Server:**
   ```bash
   cd server
   npm install
   cp .env.example .env # Configure your variables
   ```

3. **Setup Client:**
   ```bash
   cd ../client
   npm install
   cp .env.example .env # Configure your variables
   ```

4. **Setup Chrome Extension:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `chrome-extension` folder

### Running the App

1. **Start the Backend:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the Frontend:**
   ```bash
   cd client
   npm run dev
   ```

## Environment Variables

### Server (`server/.env`)
| Variable | Description |
|----------|-------------|
| `MONGO_URL` | MongoDB connection string |
| `REDIS_HOST` | Redis server host |
| `REDIS_PORT` | Redis server port |
| `REDIS_PASSWORD` | Redis server password |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `JWT_SECRET` | Secret for JSON Web Tokens |
| `MISTRAL_API_KEY` | MistralAI API key for content extraction |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key for storage |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key for storage |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint |

### Client (`client/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `VITE_API_URL` | Base API URL for the backend |
