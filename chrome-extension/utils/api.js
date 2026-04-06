export const EXTENSION_CONFIG = {
  apiBaseUrl: "https://mindfolio-putb.onrender.com",
  authMePath: "/auth/me",
  savePath: "/save",
  loginUrl: "https://mindfolio-delta.vercel.app/login",
  openLoginOnAuthFailure: true,
  retryAttempts: 1,
};

function joinUrl(baseUrl, path) {
  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

async function parseResponseBody(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : {};
}

export async function requestJson(url, init = {}) {
  try {
    const response = await fetch(url, init);
    const data = await parseResponseBody(response);

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: {
        message: error instanceof Error ? error.message : "Network request failed",
      },
    };
  }
}

/**
 * Sends a payload to the backend using Bearer token auth (not cookies).
 * The token is read from chrome.storage.local via getStoredToken().
 */
export async function sendPayloadToBackend(payload) {
  const { getStoredToken } = await import("./auth.js");
  const token = await getStoredToken();

  const url = joinUrl(EXTENSION_CONFIG.apiBaseUrl, EXTENSION_CONFIG.savePath);
  const attempts = Math.max(0, EXTENSION_CONFIG.retryAttempts) + 1;

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const response = await requestJson(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 401 || attempt === attempts - 1) {
      return response;
    }
  }

  return {
    ok: false,
    status: 0,
    data: {
      message: "Request failed after retrying.",
    },
  };
}

export function buildApiUrl(path) {
  return joinUrl(EXTENSION_CONFIG.apiBaseUrl, path);
}
