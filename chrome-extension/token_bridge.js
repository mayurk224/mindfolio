/**
 * token_bridge.js
 *
 * Runs ONLY on the Mindfolio web app (mindfolio-delta.vercel.app and localhost:5173).
 * Reads the JWT token from localStorage and syncs it to chrome.storage.local
 * so popup.js / background.js can authenticate without cookie-based cross-origin issues.
 */

(function mindfolioTokenBridge() {
  const TOKEN_KEY = "mindfolio_token";

  function syncToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      chrome.storage.local.set({ mindfolio_token: token });
    } else {
      chrome.storage.local.remove("mindfolio_token");
    }
  }

  // Sync immediately on page load
  syncToken();

  // Watch for storage changes (login / logout) in the same tab
  window.addEventListener("storage", (event) => {
    if (event.key === TOKEN_KEY) {
      if (event.newValue) {
        chrome.storage.local.set({ mindfolio_token: event.newValue });
      } else {
        chrome.storage.local.remove("mindfolio_token");
      }
    }
  });

  // Also respond to explicit messages from the extension asking for the token
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "MINDFOLIO_GET_TOKEN") {
      const token = localStorage.getItem(TOKEN_KEY);
      sendResponse({ token: token || null });
    }
    return false;
  });
})();
