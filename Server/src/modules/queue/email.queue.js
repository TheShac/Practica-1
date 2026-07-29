import { Queue } from "bullmq";
import { redisConnection } from "./redis.client.js";

export const emailQueue = new Queue("email", { connection: redisConnection });

export async function encolarEmail(tipo, payload) {
  await emailQueue.add(tipo, payload, {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  });
}