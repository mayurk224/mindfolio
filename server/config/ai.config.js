import dotenv from "dotenv";
dotenv.config();
import { Queue } from "bullmq";
import Redis from "ioredis";
import { ChatMistralAI, MistralAIEmbeddings } from "@langchain/mistralai";
import { z } from "zod";

// Redis
export const redisConnection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Queue
export const aiQueue = new Queue("content-processing", {
  connection: redisConnection,
});

// LLM
const llm = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-small-latest",
  temperature: 0,
});

export const embedder = new MistralAIEmbeddings({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-embed",
});

// Schema
// Inside services/aiWorker.js

const tagSchema = z.object({
  summary: z.string().describe("A concise 2-sentence summary of the content."),
  tags: z
    .array(z.string())
    .max(6)
    .min(4)
    .describe("An array of 4 to 6 highly relevant tags/keywords."),

  // NEW: Let the AI figure out what kind of content this is!
  type: z
    .enum([
      "web",
      "images",
      "videos",
      "documents",
      "articles",
      "notes",
      "youtube",
      "quotes",
      "posts",
      "snippets",
      "other",
    ])
    .describe("Categorize the type of content based on the text provided."),
});

// Structured output
export const structuredLlm = llm.withStructuredOutput(tagSchema);
