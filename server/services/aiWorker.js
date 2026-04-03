import { Worker } from "bullmq";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { itemModel } from "../models/item.model.js";
import { redisConnection, structuredLlm, embedder } from "../config/ai.config.js";

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

// --- Worker ---
export const aiWorker = new Worker(
  "content-processing",
  async (job) => {
    const { documentId, url, textContent } = job.data;

    console.log(`[Worker] 🚀 Processing: ${documentId}`);

    try {
      await itemModel.findByIdAndUpdate(documentId, {
        status: "processing",
      });

      let contentToAnalyze = textContent;
      let finalTitle = "Untitled Document"; // Fallback

      // Scrape the URL
      if (url && !contentToAnalyze) {
        console.log(`[Worker] 🕷️ Scraping URL: ${url}`);
        const articleData = await extractTextFromUrl(url);

        if (articleData) {
          contentToAnalyze = articleData.textContent;
          finalTitle = articleData.title; // <--- Grab the perfect title!
        }
      }

      if (!contentToAnalyze) {
        throw new Error("No readable text found.");
      }

      const cleanText = contentToAnalyze.slice(0, 15000);

      console.log(`[Worker] 🧠 Calling AI...`);

      const aiResult = await structuredLlm.invoke(`
        Analyze the following text and extract the required information.
        TEXT:
        ${cleanText}
      `);

      console.log(`[Worker] 🧬 Generating Embedding...`);
      const embedding = await embedder.embedQuery(cleanText);

      await itemModel.findByIdAndUpdate(documentId, {
        status: "completed",
        title: finalTitle, // From the scraper
        type: aiResult.type, // From Mistral AI
        summary: aiResult.summary, // From Mistral AI
        aiTags: aiResult.tags, // From Mistral AI
        embedding: embedding, // <--- SAVE TO MONGO!
      });

      console.log(`[Worker] ✅ Done`, aiResult.tags);
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
