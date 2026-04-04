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

// Zod validation schema
const tagSchema = z.object({
  summary: z.string().describe("A concise 2-sentence summary of the content."),
  tags: z
    .array(z.string())
    .max(6)
    .min(3)
    .describe(
      "An array of relevant keywords. CRITICAL: You MUST return a maximum of 6 tags. Do not exceed 6 tags under any circumstances.",
    ),

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
    .describe(
      "Categorize the content. CRITICAL: If the content is a news story, press release, or blog, you MUST classify it as 'articles'.",
    ),
});

// Structured output
export const structuredLlm = llm.withStructuredOutput(tagSchema);
