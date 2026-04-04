import { Queue } from "bullmq";
import { redisConnection } from "../config/ai.config.js";

export const processingQueue = new Queue("content-processing", {
  connection: redisConnection,
});
