(function initMindfolioExtension() {
  if (window.__mindfolioExtensionLoaded) {
    return;
  }

  window.__mindfolioExtensionLoaded = true;

  const TOAST_ROOT_ID = "mindfolio-extension-toast-root";
  let lastContextSnapshot = null;

  function normalizeText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function normalizeUrl(value) {
    const text = normalizeText(value);

    if (!text) {
      return "";
    }

    try {
      return new URL(text, window.location.href).toString();
    } catch {
      return "";
    }
  }

  function getClosestElement(target, selector) {
    if (!(target instanceof Element)) {
      return null;
    }

    return target.closest(selector);
  }

  function getMetaDescription() {
    const selectors = [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ];

    for (const selector of selectors) {
      const content = normalizeText(
        document.querySelector(selector)?.getAttribute("content"),
      );

      if (content) {
        return content;
      }
    }

    return "";
  }

  function getPageTitle() {
    const selectors = [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ];

    for (const selector of selectors) {
      const content = normalizeText(
        document.querySelector(selector)?.getAttribute("content"),
      );

      if (content) {
        return content;
      }
    }

    return normalizeText(document.title);
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

  function captureContextSnapshot(target) {
    const anchor = getClosestElement(target, "a[href]");
    const image = target instanceof HTMLImageElement
      ? target
      : getClosestElement(target, "img");
    const video = target instanceof HTMLVideoElement
      ? target
      : getClosestElement(target, "video");
    const pageUrl = normalizeUrl(window.location.href);
    const linkUrl = normalizeUrl(anchor?.href);
    const imageUrl = normalizeUrl(
      image?.currentSrc || image?.src || image?.getAttribute("src"),
    );
    const videoUrl = normalizeUrl(
      video?.currentSrc || video?.src || video?.getAttribute("src"),
    );

    return {
      pageUrl,
      title: getPageTitle(),
      metaDescription: getMetaDescription(),
      linkUrl,
      linkText: normalizeText(anchor?.textContent),
      imageUrl,
      videoUrl,
      youtubeVideoUrl: getYoutubeVideoUrl(linkUrl, pageUrl),
    };
  }

  function ensureToastRoot() {
    let root = document.getElementById(TOAST_ROOT_ID);

    if (root) {
      return root;
    }

    root = document.createElement("div");
    root.id = TOAST_ROOT_ID;
    root.style.position = "fixed";
    root.style.top = "16px";
    root.style.right = "16px";
    root.style.zIndex = "2147483647";
    root.style.display = "flex";
    root.style.flexDirection = "column";
    root.style.gap = "10px";
    root.style.pointerEvents = "none";
    document.documentElement.appendChild(root);
    return root;
  }

  function getToastStyle(variant) {
    if (variant === "success") {
      return {
        background: "#0f766e",
        border: "#14b8a6",
      };
    }

    if (variant === "error") {
      return {
        background: "#991b1b",
        border: "#ef4444",
      };
    }

    if (variant === "loading") {
      return {
        background: "#1d4ed8",
        border: "#60a5fa",
      };
    }

    return {
      background: "#1f2937",
      border: "#4b5563",
    };
  }

  function showToast(message, variant = "info") {
    const root = ensureToastRoot();
    const toast = document.createElement("div");
    const colors = getToastStyle(variant);

    toast.textContent = message;
    toast.style.minWidth = "220px";
    toast.style.maxWidth = "320px";
    toast.style.padding = "12px 14px";
    toast.style.borderRadius = "12px";
    toast.style.border = `1px solid ${colors.border}`;
    toast.style.background = colors.background;
    toast.style.color = "#ffffff";
    toast.style.fontFamily =
      '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif';
    toast.style.fontSize = "14px";
    toast.style.lineHeight = "1.4";
    toast.style.boxShadow = "0 18px 45px rgba(15, 23, 42, 0.32)";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-8px)";
    toast.style.transition = "opacity 180ms ease, transform 180ms ease";

    root.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });

    window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-8px)";

      window.setTimeout(() => {
        toast.remove();
      }, 220);
    }, variant === "loading" ? 1400 : 2600);
  }

  document.addEventListener(
    "contextmenu",
    (event) => {
      lastContextSnapshot = captureContextSnapshot(event.target);
    },
    true,
  );

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "MINDFOLIO_EXTENSION_PING") {
      sendResponse({ ok: true });
      return false;
    }

    if (message?.type === "MINDFOLIO_EXTENSION_GET_CONTEXT") {
      sendResponse(lastContextSnapshot || captureContextSnapshot(document.body));
      return false;
    }

    if (message?.type === "MINDFOLIO_EXTENSION_SHOW_TOAST") {
      showToast(message.payload?.message, message.payload?.variant);
      sendResponse({ ok: true });
      return false;
    }

    return false;
  });
})();
