import { EXTENSION_CONFIG, buildApiUrl, requestJson } from "./api.js";

/**
 * Retrieves the cached auth token from chrome.storage.local.
 * The token is written there by token_bridge.js which runs on the Mindfolio web app.
 */
export function getStoredToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get("mindfolio_token", (result) => {
      resolve(result.mindfolio_token || null);
    });
  });
}

/**
 * Checks whether the user is currently authenticated.
 *
 * Strategy:
 * 1. Read the JWT from chrome.storage.local (set by token_bridge.js on the Mindfolio app).
 * 2. If no token → not authenticated.
 * 3. If token found → call /auth/me with Authorization: Bearer <token> header.
 */
export async function checkAuthentication() {
  const token = await getStoredToken();

  if (!token) {
    return { ok: false, status: 0, data: {}, isAuthenticated: false };
  }

  const response = await requestJson(buildApiUrl(EXTENSION_CONFIG.authMePath), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const isAuthenticated = response.ok && response.data?.isAuthenticated !== false;

  // If token is invalid/expired, clear it from storage
  if (!isAuthenticated) {
    chrome.storage.local.remove("mindfolio_token");
  }

  return { ...response, isAuthenticated };
}
