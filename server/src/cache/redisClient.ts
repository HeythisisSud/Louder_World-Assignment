import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL, // ✅ Upstash URL
});

redis.on("connect", () => {
  console.log("✅ Redis connected (Upstash)");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}

export default redis;
