import { checkAuthentication } from "./utils/auth.js";
import {
  EXTENSION_CONFIG,
  sendPayloadToBackend,
  buildApiUrl,
} from "./utils/api.js";

// ─── Helpers ────────────────────────────────────────────────────────────────

function normalizeUrl(value) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return "";
  try {
    return new URL(text).toString();
  } catch {
    return "";
  }
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isYoutubeUrl(url) {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtu.be"
    );
  } catch {
    return false;
  }
}

function detectContentType(url) {
  if (!url) return "webpage";
  const lowerUrl = url.toLowerCase();
  if (isYoutubeUrl(url)) return "youtube";
  if (/\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|$)/.test(lowerUrl)) return "image";
  if (/\.(mp4|webm|ogg|mov|avi)(\?|$)/.test(lowerUrl)) return "video";
  if (
    lowerUrl.includes("instagram.com") ||
    lowerUrl.includes("twitter.com") ||
    lowerUrl.includes("x.com") ||
    lowerUrl.includes("tiktok.com")
  )
    return "social";
  return "webpage";
}

// ─── DOM refs ───────────────────────────────────────────────────────────────

const formView      = document.getElementById("form-view");
const formFooter    = document.getElementById("form-footer");
const successView   = document.getElementById("success-view");
const errorView     = document.getElementById("error-view");
const authView      = document.getElementById("auth-view");

const pageUrlInput  = document.getElementById("page-url");
const titleInput    = document.getElementById("page-title");
const noteInput     = document.getElementById("page-note");
const typeBadge     = document.getElementById("type-badge");

const saveBtn       = document.getElementById("save-btn");
const saveBtnText   = document.getElementById("save-btn-text");
const saveBtnLoader = document.getElementById("save-btn-loader");
const errorMsg      = document.getElementById("error-msg");
const closeBtn      = document.getElementById("close-btn");
const retryBtn      = document.getElementById("retry-btn");
const loginBtn      = document.getElementById("login-btn");
const openAppBtn    = document.getElementById("open-app-btn");

// ─── State ───────────────────────────────────────────────────────────────────

let currentTab   = null;
let currentType  = "webpage";

// ─── View transitions ────────────────────────────────────────────────────────

function showView(viewName) {
  const allViews = [formView, formFooter, successView, errorView, authView];
  allViews.forEach((v) => v.classList.add("hidden"));

  if (viewName === "form") {
    formView.classList.remove("hidden");
    formFooter.classList.remove("hidden");
  } else if (viewName === "success") {
    successView.classList.remove("hidden");
  } else if (viewName === "error") {
    errorView.classList.remove("hidden");
  } else if (viewName === "auth") {
    authView.classList.remove("hidden");
  }
}

function setLoading(isLoading) {
  if (isLoading) {
    saveBtnText.classList.add("hidden");
    saveBtnLoader.classList.remove("hidden");
    saveBtn.disabled = true;
  } else {
    saveBtnText.classList.remove("hidden");
    saveBtnLoader.classList.add("hidden");
    saveBtn.disabled = false;
  }
}

// ─── Initialise ──────────────────────────────────────────────────────────────

async function init() {
  // Hydrate open-app link
  openAppBtn.href = EXTENSION_CONFIG.loginUrl.replace(/\/login$/, "") || "https://mindfolio-delta.vercel.app";

  // Check auth first
  const authResult = await checkAuthentication();
  if (!authResult.isAuthenticated) {
    showView("auth");
    return;
  }

  // Get current tab
  const [tab] = await new Promise((resolve) =>
    chrome.tabs.query({ active: true, currentWindow: true }, resolve)
  );

  currentTab = tab;

  const url = normalizeUrl(tab?.url);
  const title = normalizeText(tab?.title);

  pageUrlInput.value = url;
  titleInput.value = title;

  currentType = detectContentType(url);
  typeBadge.textContent = currentType;

  showView("form");
}

// ─── Save ────────────────────────────────────────────────────────────────────

async function handleSave() {
  const url   = normalizeUrl(pageUrlInput.value);
  const title = normalizeText(titleInput.value);
  const note  = normalizeText(noteInput.value);

  if (!url) {
    errorMsg.textContent = "No valid page URL found.";
    showView("error");
    return;
  }

  setLoading(true);

  const payload = {
    type: currentType === "youtube" ? "youtube_video" : currentType,
    pageUrl: url,
    resourceUrl: "",
    title,
    description: note,
  };

  try {
    const response = await sendPayloadToBackend(payload);

    if (response.ok) {
      showView("success");
      return;
    }

    if (response.status === 401) {
      showView("auth");
      return;
    }

    const serverMsg = response.data?.message;
    errorMsg.textContent = serverMsg || "Something went wrong. Please try again.";
    showView("error");
  } catch (err) {
    errorMsg.textContent = "Network error. Check your connection.";
    showView("error");
  } finally {
    setLoading(false);
  }
}

// ─── Event listeners ─────────────────────────────────────────────────────────

saveBtn.addEventListener("click", handleSave);

closeBtn.addEventListener("click", () => window.close());

retryBtn.addEventListener("click", () => {
  showView("form");
  setLoading(false);
});

loginBtn.addEventListener("click", () => {
  chrome.tabs.create({ url: EXTENSION_CONFIG.loginUrl });
  window.close();
});

openAppBtn.addEventListener("click", (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: openAppBtn.href });
  window.close();
});

// ─── Boot ────────────────────────────────────────────────────────────────────

init();
