# Mindfolio Server

The intelligent backend engine for Mindfolio, handling AI extraction, storage, and real-time synchronization.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/LangChain-Latest-E34F26?logo=langchain&logoColor=white" alt="LangChain" />
  <img src="https://img.shields.io/badge/MistralAI-Latest-000000?logo=mistral&logoColor=white" alt="MistralAI" />
  <img src="https://img.shields.io/badge/BullMQ-Latest-FF0000?logo=bull&logoColor=white" alt="BullMQ" />
</p>

## Overview

The Mindfolio Server is a robust Node.js and Express backend that powers the second brain's core intelligence. It handles complex tasks such as web scraping, AI-driven content extraction and summarization, secure authentication via Google OAuth, and persistent storage using MongoDB and ImageKit. With the integration of BullMQ and Redis, it processes background tasks efficiently to ensure a smooth user experience.

## Key Features

- **AI Content Extraction**: Uses LangChain and MistralAI to automatically summarize and categorize incoming bookmarks.
- **Web Scraping**: Leverages Mozilla Readability and jsdom to extract clean content from webpages.
- **Image & PDF Processing**: Handles image uploads to ImageKit and extracts text from PDFs for indexing.
- **Social Media Integration**: Scrapes data from Instagram and other platforms via RapidAPI for seamless saving.
- **Real-time Sync**: Provides instant feedback to the client via Socket.io when items are saved or updated.
- **Secure Authentication**: Robust session management with Google OAuth and JWT.

## Architecture & Structure

```text
server/
├── config/             # Database and cloud service configurations
├── controllers/        # Logical handlers for API routes
├── models/             # Mongoose/MongoDB data schemas
├── middlewares/        # Express middleware (Auth, error handling)
├── routes/             # RESTful API route definitions
├── services/           # External service integrations (AI, Email, Storage)
├── utils/              # General-purpose utility functions
├── server.js           # Server entry point and configuration
└── package.json        # Dependencies and scripts
```

## Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: A running instance (local or Atlas)
- **Redis**: Required for BullMQ background processing
- **ImageKit**: Account for cloud image storage

### Installation

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file and add your credentials (see the table below).

### Running the App

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Start for production:**
   ```bash
   npm start
   ```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URL` | Your MongoDB connection string. |
| `REDIS_HOST` | Host address for your Redis instance. |
| `REDIS_PORT` | Port for your Redis instance. |
| `REDIS_PASSWORD`| Password for your Redis instance (if required). |
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID for server-side auth. |
| `GOOGLE_CLIENT_SECRET`| Your Google OAuth Client Secret. |
| `JWT_SECRET` | Secret key used for signing JSON Web Tokens. |
| `MISTRAL_API_KEY` | Your MistralAI API key for content summarization. |
| `IMAGEKIT_PUBLIC_KEY` | Public key from your ImageKit dashboard. |
| `IMAGEKIT_PRIVATE_KEY`| Private key from your ImageKit dashboard. |
| `IMAGEKIT_URL_ENDPOINT`| Your ImageKit URL endpoint. |
| `RAPIDAPI_KEY` | Your RapidAPI key for social media scraping. |
| `RAPIDAPI_HOST` | Host endpoint for social media scraping API. |
