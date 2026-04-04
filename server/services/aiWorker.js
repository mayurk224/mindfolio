import { HumanMessage } from "@langchain/core/messages";
import { Worker } from "bullmq";
import { PDFParse } from "pdf-parse";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { itemModel } from "../models/item.model.js";
import {
  redisConnection,
  structuredLlm,
  embedder,
  tagSchema,
  ChatMistralAI,
} from "../config/ai.config.js";

// --- Scraper ---
async function extractTextFromUrl(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const doc = new JSDOM(html, { url });
    const reader = new Readability(doc.window.document);
    return reader.parse(); // <--- Return the whole object, which includes .title and .textContent
  } catch (error) {
    console.error(`Failed to scrape ${url}:`, error);
    return null;
  }
}

function normalizeMetadataValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function extractMetaContent(doc, selector) {
  return normalizeMetadataValue(
    doc.querySelector(selector)?.getAttribute("content"),
  );
}

function extractYouTubeVideoId(rawUrl) {
  try {
    const parsedUrl = new URL(rawUrl);
    const host = parsedUrl.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return normalizeMetadataValue(
        parsedUrl.pathname.split("/").filter(Boolean)[0],
      );
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsedUrl.pathname === "/watch") {
        return normalizeMetadataValue(parsedUrl.searchParams.get("v"));
      }

      const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
      if (["shorts", "embed", "live"].includes(pathSegments[0])) {
        return normalizeMetadataValue(pathSegments[1]);
      }
    }
  } catch (error) {
    console.error(`Failed to parse YouTube URL ${rawUrl}:`, error);
  }

  return "";
}

function parseJsonLdObjects(doc) {
  return [
    ...doc.querySelectorAll('script[type="application/ld+json"]'),
  ].flatMap((script) => {
    try {
      const parsed = JSON.parse(script.textContent);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  });
}

async function extractYouTubeMetadata(rawUrl) {
  const metadata = {
    canonicalUrl: rawUrl,
    title: "",
    author: "",
    description: "",
    thumbnailUrl: "",
  };

  const videoId = extractYouTubeVideoId(rawUrl);
  if (!videoId) {
    return metadata;
  }

  metadata.canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    const oEmbedResponse = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(metadata.canonicalUrl)}&format=json`,
    );

    if (oEmbedResponse.ok) {
      const oEmbedData = await oEmbedResponse.json();
      metadata.title = normalizeMetadataValue(oEmbedData.title);
      metadata.author = normalizeMetadataValue(oEmbedData.author_name);
      metadata.thumbnailUrl = normalizeMetadataValue(oEmbedData.thumbnail_url);
    }
  } catch (error) {
    console.error(`Failed to load YouTube oEmbed for ${rawUrl}:`, error);
  }

  try {
    const pageResponse = await fetch(metadata.canonicalUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      },
    });

    if (!pageResponse.ok) {
      return metadata;
    }

    const html = await pageResponse.text();
    const doc = new JSDOM(html, { url: metadata.canonicalUrl }).window.document;
    const jsonLdObjects = parseJsonLdObjects(doc);
    const videoObject = jsonLdObjects.find((entry) => {
      const entryType = entry?.["@type"];
      return Array.isArray(entryType)
        ? entryType.includes("VideoObject")
        : entryType === "VideoObject";
    });

    metadata.title =
      metadata.title ||
      normalizeMetadataValue(videoObject?.name) ||
      extractMetaContent(doc, 'meta[property="og:title"]');

    metadata.description =
      metadata.description ||
      normalizeMetadataValue(videoObject?.description) ||
      extractMetaContent(doc, 'meta[property="og:description"]') ||
      extractMetaContent(doc, 'meta[name="description"]');

    metadata.author =
      metadata.author ||
      normalizeMetadataValue(videoObject?.author?.name) ||
      extractMetaContent(doc, 'meta[name="author"]') ||
      extractMetaContent(doc, 'meta[itemprop="author"]');

    metadata.thumbnailUrl =
      metadata.thumbnailUrl ||
      normalizeMetadataValue(
        Array.isArray(videoObject?.thumbnailUrl)
          ? videoObject.thumbnailUrl[0]
          : videoObject?.thumbnailUrl,
      ) ||
      extractMetaContent(doc, 'meta[property="og:image"]');
  } catch (error) {
    console.error(`Failed to load YouTube page metadata for ${rawUrl}:`, error);
  }

  return metadata;
}

// --- Worker ---
export const aiWorker = new Worker(
  "content-processing",
  async (job) => {
    const { documentId, url, textContent, sourceTitle, sourceType } = job.data;

    console.log(`[Worker] 🚀 Processing: ${documentId}`);

    try {
      await itemModel.findByIdAndUpdate(documentId, {
        status: "processing",
      });

      let aiResponse;
      let textToEmbed;
      let finalTitle = sourceTitle?.trim() || "Untitled Content";
      let finalType = sourceType || job.data.type || "other";
      let finalAuthor = "";
      let finalThumbnailUrl = "";

      if (job.data.type === "images") {
        console.log(`[Worker] 👁️ Analyzing Image: ${url}`);

        const visionModel = new ChatMistralAI({
          model: "pixtral-12b-2409",
          apiKey: process.env.MISTRAL_API_KEY,
        }).withStructuredOutput(tagSchema);

        aiResponse = await visionModel.invoke([
          new HumanMessage({
            content: [
              {
                type: "text",
                text: "Analyze this image and generate a professional title, a 2-sentence summary, and 3-6 relevant tags. Set the 'type' to 'images'.",
              },
              { type: "image_url", image_url: url },
            ],
          }),
        ]);

        finalTitle =
          sourceTitle?.trim() || aiResponse.title || "Image Analysis";
        textToEmbed = `${aiResponse.title}. ${aiResponse.summary} ${aiResponse.tags.join(", ")}`;
        finalType = sourceType || job.data.type || "images";
      } else if (job.data.type === "documents") {
        console.log("[Worker] 📄 Downloading and extracting document text...");
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let extractedText = "";
        if (url.toLowerCase().split("?")[0].endsWith(".pdf")) {
          const parser = new PDFParse({ data: buffer });
          const pdfData = await parser.getText();
          extractedText = pdfData.text;
          await parser.destroy();
        } else {
          // Fallback for .txt, .md, etc.
          extractedText = buffer.toString("utf-8");
        }

        // Safety net: truncate to avoid blowing up context window
        const safeText = extractedText.substring(0, 25000);

        aiResponse = await structuredLlm.invoke(
          "Analyze this document. Provide a title, summary, and tags. Type MUST be 'documents'.\n\n" +
            safeText,
        );

        textToEmbed = safeText;
        finalTitle =
          sourceTitle?.trim() || aiResponse.title || "Document Analysis";
        finalType = sourceType || job.data.type || "documents";
      } else if (job.data.type === "youtube") {
        console.log(`[Worker] Processing YouTube Link: ${url}`);
        const youtubeMetadata = await extractYouTubeMetadata(url);
        const metadataTitle =
          youtubeMetadata.title || sourceTitle?.trim() || "";
        finalTitle = sourceTitle?.trim() || metadataTitle || "YouTube Video";
        finalAuthor = youtubeMetadata.author;
        finalThumbnailUrl = youtubeMetadata.thumbnailUrl;

        aiResponse = await structuredLlm.invoke(`
          Analyze this YouTube video using the metadata below.
          Use the metadata to produce a clean title, a concise 2-sentence summary, and 3-6 relevant tags.
          Do not invent specific claims, steps, or timestamps that are not supported by the metadata.
          If the metadata is limited, keep the summary cautious and focused on the likely topic and format.
          Type MUST be "youtube".
          VIDEO URL: ${youtubeMetadata.canonicalUrl}
          VIDEO TITLE: ${metadataTitle || "Unknown"}
          CHANNEL: ${youtubeMetadata.author || "Unknown"}
          DESCRIPTION: ${youtubeMetadata.description || "Not available"}
        `);

        finalTitle =
          sourceTitle?.trim() ||
          youtubeMetadata.title ||
          aiResponse.title ||
          "YouTube Video";
        textToEmbed = [
          finalTitle,
          youtubeMetadata.author,
          youtubeMetadata.description,
          aiResponse.summary,
          aiResponse.tags.join(", "),
          youtubeMetadata.canonicalUrl,
        ]
          .filter(Boolean)
          .join(". ");
        finalType = "youtube";
      } else if (job.data.type === "__legacy_youtube__") {
        console.log(`[Worker] 📺 Analyzing YouTube Link: ${url}`);
        // For YouTube, we mainly use the URL and any provided Title
        // since simple scraping won't get transcripts or descriptions easily.
        aiResponse = await structuredLlm.invoke(`
          Analyze this YouTube video link and provided title.
          Provide a professional title, a 2-sentence summary of what the video likely contains, and relevant tags.
          VIDEO URL: ${url}
          PROVIDED TITLE: ${finalTitle}
        `);

        textToEmbed = `${finalTitle}. ${aiResponse.summary} ${url}`;
        finalType = "youtube";
      } else if (job.data.type === "web") {
        // Standard Web Scraping Logic
        let contentToAnalyze = textContent;

        if (url && !contentToAnalyze) {
          console.log(`[Worker] 🕷️ Scraping URL: ${url}`);
          const articleData = await extractTextFromUrl(url);

          if (articleData) {
            contentToAnalyze = articleData.textContent;
            if (!sourceTitle?.trim()) {
              finalTitle = articleData.title || finalTitle;
            }
          }
        }

        // If scraping failed or returned nothing, don't throw!
        // Let the AI analyze based on the URL and Title.
        if (!contentToAnalyze) {
          console.warn(
            `[Worker] ⚠️ No readable text found for ${url}. Falling back to metadata analysis.`,
          );

          aiResponse = await structuredLlm.invoke(`
            I couldn't extract full text from this webpage. 
            Based ONLY on the URL and the title, provide a professional title, a 2-sentence summary, and 5 relevant tags.
            URL: ${url}
            TITLE: ${finalTitle}
          `);

          textToEmbed = `${finalTitle}. ${aiResponse.summary} ${url}`;
        } else {
          const cleanText = contentToAnalyze.slice(0, 15000);
          console.log(`[Worker] 🧠 Calling AI for Text...`);

          aiResponse = await structuredLlm.invoke(`
            Analyze the following text and extract the required information.
            CRITICAL: You MUST return a maximum of 6 tags. Do not exceed this limit under any circumstances.
            TEXT:
            ${cleanText}
          `);

          textToEmbed = cleanText;
        }

        if (!sourceTitle?.trim()) {
          finalTitle = aiResponse.title || finalTitle || "Web Content";
        }
        finalType = sourceType || aiResponse.type || finalType;
      } else {
        throw new Error(`Unsupported job type: ${job.data.type}`);
      }

      console.log(`[Worker] 🧬 Generating Embedding...`);
      const embedding = await embedder.embedQuery(textToEmbed);

      const updatePayload = {
        status: "completed",
        title: finalTitle,
        type: finalType,
        summary: aiResponse.summary,
        aiTags: aiResponse.tags,
        embedding: embedding,
      };

      if (finalAuthor) {
        updatePayload.author = finalAuthor;
      }

      if (finalThumbnailUrl) {
        updatePayload.thumbnailUrl = finalThumbnailUrl;
      }

      await itemModel.findByIdAndUpdate(documentId, updatePayload);

      console.log(`[Worker] ✅ Done`, aiResponse.tags);
    } catch (error) {
      console.error(`[Worker] ❌ Error`, error);

      await itemModel.findByIdAndUpdate(documentId, {
        status: "failed",
      });
    }
  },
  { connection: redisConnection },
);

// --- Debugging & Event Listeners ---

// 1. Connection Logging
redisConnection.on("connect", () => {
  console.log("🔗 Redis connected successfully!");
});

redisConnection.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

// 2. Worker Event Listeners
aiWorker.on("ready", () => {
  console.log("🤖 AI Worker is ready and waiting for jobs...");
});

aiWorker.on("active", (job) => {
  console.log(`🚀 Job ${job.id} started processing...`);
});

aiWorker.on("completed", (job, result) => {
  console.log(`✅ Job ${job.id} completed!`);
});

aiWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});

// 3. Boot-up Log
console.log(
  "🤖 AI Worker initialized and listening to queue: content-processing",
);
