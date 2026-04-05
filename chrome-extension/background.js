import { checkAuthentication } from "./utils/auth.js";
import { EXTENSION_CONFIG, sendPayloadToBackend } from "./utils/api.js";

const MENU_ID = "mindfolio-send-to-mindfolio";
const MENU_TITLE = "Send to MindFolio";

function createContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: MENU_TITLE,
      contexts: ["page", "image", "video", "link"],
    });
  });
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUrl(value) {
  const text = normalizeText(value);

  if (!text) {
    return "";
  }

  try {
    return new URL(text).toString();
  } catch {
    return "";
  }
}

function isSupportedTab(tab) {
  const tabUrl = normalizeUrl(tab?.url);

  if (!tabUrl) {
    return false;
  }

  const protocol = new URL(tabUrl).protocol;
  return protocol === "http:" || protocol === "https:";
}

function isYoutubeUrl(url) {
  const normalizedUrl = normalizeUrl(url);

  if (!normalizedUrl) {
    return false;
  }

  const hostname = new URL(normalizedUrl).hostname.replace(/^www\./, "");
  return hostname === "youtube.com" || hostname === "m.youtube.com" || hostname === "youtu.be";
}

function getYoutubeVideoUrl(...candidates) {
  for (const candidate of candidates) {
    const normalizedUrl = normalizeUrl(candidate);

    if (!normalizedUrl) {
      continue;
    }

    const url = new URL(normalizedUrl);
    const hostname = url.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];

      if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const watchId = url.searchParams.get("v");

      if (watchId) {
        return `https://www.youtube.com/watch?v=${watchId}`;
      }

      const shortsMatch = url.pathname.match(/^\/shorts\/([^/?#]+)/);
      if (shortsMatch?.[1]) {
        return `https://www.youtube.com/watch?v=${shortsMatch[1]}`;
      }

      const embedMatch = url.pathname.match(/^\/embed\/([^/?#]+)/);
      if (embedMatch?.[1]) {
        return `https://www.youtube.com/watch?v=${embedMatch[1]}`;
      }
    }
  }

  return "";
}

function sendMessageToTab(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      resolve(response);
    });
  });
}

function executeScript(tabId, files) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        files,
      },
      () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        resolve();
      },
    );
  });
}

async function ensureContentScript(tabId) {
  try {
    await sendMessageToTab(tabId, { type: "MINDFOLIO_EXTENSION_PING" });
  } catch {
    await executeScript(tabId, ["content.js"]);
  }
}

async function showToast(tabId, message, variant = "info") {
  if (!tabId) {
    return;
  }

  try {
    await ensureContentScript(tabId);
    await sendMessageToTab(tabId, {
      type: "MINDFOLIO_EXTENSION_SHOW_TOAST",
      payload: { message, variant },
    });
  } catch (error) {
    console.warn("Failed to show toast:", error);
  }
}

async function getTabContext(tabId) {
  if (!tabId) {
    return null;
  }

  try {
    await ensureContentScript(tabId);
    return await sendMessageToTab(tabId, {
      type: "MINDFOLIO_EXTENSION_GET_CONTEXT",
    });
  } catch (error) {
    console.warn("Failed to read tab context:", error);
    return null;
  }
}

function buildPayload(info, tab, tabContext) {
  const currentPageUrl = normalizeUrl(
    tabContext?.pageUrl || info.pageUrl || tab?.url,
  );
  const title = normalizeText(tabContext?.title || tab?.title);
  const description = normalizeText(tabContext?.metaDescription);
  const targetYoutubeUrl = getYoutubeVideoUrl(
    info.linkUrl,
    tabContext?.linkUrl,
  );
  const pageYoutubeUrl = getYoutubeVideoUrl(currentPageUrl);

  if (info.mediaType === "video" && pageYoutubeUrl) {
    return {
      type: "youtube_video",
      pageUrl: currentPageUrl,
      resourceUrl: pageYoutubeUrl,
      title,
      description,
    };
  }

  if (info.linkUrl && targetYoutubeUrl) {
    return {
      type: "youtube_video",
      pageUrl: currentPageUrl,
      resourceUrl: targetYoutubeUrl,
      title: normalizeText(tabContext?.linkText || title),
      description,
    };
  }

  if (info.mediaType === "image" && targetYoutubeUrl) {
    return {
      type: "youtube_video",
      pageUrl: currentPageUrl,
      resourceUrl: targetYoutubeUrl,
      title,
      description,
    };
  }

  if (info.mediaType === "image") {
    return {
      type: "image",
      pageUrl: currentPageUrl,
      resourceUrl: normalizeUrl(info.srcUrl || tabContext?.imageUrl),
      title,
      description,
    };
  }

  if (info.mediaType === "video") {
    return {
      type: "video",
      pageUrl: currentPageUrl,
      resourceUrl: normalizeUrl(info.srcUrl || tabContext?.videoUrl),
      title,
      description,
    };
  }

  if (info.linkUrl) {
    const linkedUrl = normalizeUrl(info.linkUrl);

    return {
      type: "webpage",
      pageUrl: linkedUrl,
      resourceUrl: "",
      title: normalizeText(tabContext?.linkText || title),
      description,
    };
  }

  return {
    type: "webpage",
    pageUrl: currentPageUrl,
    resourceUrl: "",
    title,
    description,
  };
}

async function handleContextMenuClick(info, tab) {
  if (info.menuItemId !== MENU_ID || !isSupportedTab(tab)) {
    return;
  }

  const authResult = await checkAuthentication();

  if (!authResult.isAuthenticated) {
    await showToast(tab.id, "Please login first", "error");

    if (EXTENSION_CONFIG.openLoginOnAuthFailure && EXTENSION_CONFIG.loginUrl) {
      chrome.tabs.create({ url: EXTENSION_CONFIG.loginUrl });
    }

    return;
  }

  await showToast(tab.id, "Sending...", "loading");

  const tabContext = await getTabContext(tab.id);
  const payload = buildPayload(info, tab, tabContext);

  if (!payload.pageUrl && !payload.resourceUrl) {
    await showToast(tab.id, "Something went wrong", "error");
    return;
  }

  const response = await sendPayloadToBackend(payload);

  if (response.ok) {
    await showToast(tab.id, "Sent successfully", "success");
    return;
  }

  if (response.status === 401) {
    await showToast(tab.id, "Please login first", "error");

    if (EXTENSION_CONFIG.openLoginOnAuthFailure && EXTENSION_CONFIG.loginUrl) {
      chrome.tabs.create({ url: EXTENSION_CONFIG.loginUrl });
    }

    return;
  }

  await showToast(tab.id, "Something went wrong", "error");
}

chrome.runtime.onInstalled.addListener(createContextMenu);
chrome.runtime.onStartup.addListener(createContextMenu);
chrome.contextMenus.onClicked.addListener((info, tab) => {
  void handleContextMenuClick(info, tab);
});
