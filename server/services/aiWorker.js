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

        finalTitle = sourceTitle?.trim() || aiResponse.title || "Image Analysis";
        textToEmbed = `${aiResponse.title}. ${aiResponse.summary} ${aiResponse.tags.join(", ")}`;
        finalType = sourceType || job.data.type || "images";
      } else if (job.data.type === "documents") {
        console.log("[Worker] 📄 Downloading and extracting document text...");
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let extractedText = "";
        if (url.toLowerCase().split('?')[0].endsWith(".pdf")) {
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
        finalTitle = sourceTitle?.trim() || aiResponse.title || "Document Analysis";
        finalType = sourceType || job.data.type || "documents";
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

        if (!contentToAnalyze) {
          throw new Error("No readable text found.");
        }

        const cleanText = contentToAnalyze.slice(0, 15000);
        console.log(`[Worker] 🧠 Calling AI for Text...`);

        aiResponse = await structuredLlm.invoke(`
          Analyze the following text and extract the required information.
          CRITICAL: You MUST return a maximum of 6 tags. Do not exceed this limit under any circumstances.
          TEXT:
          ${cleanText}
        `);

        textToEmbed = cleanText;
        if (!sourceTitle?.trim()) {
          finalTitle = aiResponse.title || finalTitle || "Web Content";
        }
        finalType = sourceType || aiResponse.type || finalType;
      } else {
        throw new Error(`Unsupported job type: ${job.data.type}`);
      }

      console.log(`[Worker] 🧬 Generating Embedding...`);
      const embedding = await embedder.embedQuery(textToEmbed);

      await itemModel.findByIdAndUpdate(documentId, {
        status: "completed",
        title: finalTitle,
        type: finalType,
        summary: aiResponse.summary,
        aiTags: aiResponse.tags,
        embedding: embedding,
      });

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
