# Mindfolio Chrome Extension

The bridge between your browser and your second brain. Save anything, instantly.

<p align="center">
  <img src="https://img.shields.io/badge/Chrome_Extension-Manifest_V3-4285F4?logo=google-chrome&logoColor=white" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/HTML5-Modern-E34F26?logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-Modern-1572B6?logo=css3&logoColor=white" alt="CSS3" />
</p>

## Overview

The Mindfolio Chrome Extension is a lightweight browser add-on that allows you to capture information from any webpage and save it directly to your Mindfolio second brain. Whether it's a snippet of text, an image, a video, or an entire webpage, the extension facilitates seamless communication with your Mindfolio server to store and process your knowledge.

## Key Features

- **Context Menu Integration**: Save images, links, and text selections with a simple right-click.
- **One-Click Save**: Capture the current page's URL and content with a single click in the extension popup.
- **Intelligent Background Sync**: Processes your save requests in the background for a non-blocking browser experience.
- **Content Injection**: Enhances your browsing experience by interacting with webpage elements to facilitate content saving.
- **Real-time Status Feed**: Provides immediate feedback via the popup on whether an item was successfully saved.

## Architecture & Structure

```text
chrome-extension/
├── background.js       # Background service worker for extension logic
├── content.js          # Content scripts injected into webpages
├── manifest.json       # Extension configuration and permissions
├── popup.html          # Extension popup UI structure
├── popup.css           # Styling for the extension popup
├── popup.js            # Interactive logic for the extension popup
├── utils/              # Extension-specific utility functions
└── mindfolio.png       # Extension icon assets
```

## Getting Started

### Prerequisites
- **Google Chrome** or any Chromium-based browser (Edge, Brave, etc.)
- A running instance of the **Mindfolio Server**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/mindfolio.git
   cd mindfolio/chrome-extension
   ```

2. **Open Chrome Extensions Page:**
   Navigate to `chrome://extensions/` in your browser.

3. **Enable Developer Mode:**
   Toggle the "Developer mode" switch in the top right corner.

4. **Load the Extension:**
   - Click "Load unpacked".
   - Select the `chrome-extension` folder from your local project directory.

### Configuration

Ensure your extension points to the correct backend API. You can find the configuration in `utils/api.js` or similar, which should match your running server's address (typically `http://localhost:8000/api` during development).

## Security & Permissions

The extension requires the following permissions to function correctly:
- **`contextMenus`**: To provide the "Save to Mindfolio" option on right-click.
- **`activeTab`**: To access the current page's URL and title for saving.
- **`scripting`**: To inject content scripts for advanced content extraction.
- **`tabs`**: To manage communication between the extension and browser tabs.
