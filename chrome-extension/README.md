# Mindfolio Chrome Extension

This extension adds a `Send to Backend` context-menu action for webpages, links, images, videos, and YouTube targets.

## Load the extension

1. Open `chrome://extensions`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select the `chrome-extension` folder

## Default endpoints

- Auth check: `http://localhost:8000/auth/me`
- Save endpoint: `http://localhost:8000/save`
- Login page: `http://localhost:5173/login`

## Backend notes

To share the login session with the extension, keep credentialed CORS enabled and allow the extension origin.

Recommended backend environment values:

- `CLIENT_URL=http://localhost:5173`
- `EXTENSION_ORIGIN=chrome-extension://<EXTENSION_ID>`
- `AUTH_COOKIE_SAME_SITE=none`
- `AUTH_COOKIE_SECURE=false` for local HTTP, or `true` for HTTPS
