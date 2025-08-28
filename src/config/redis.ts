import Redis from "ioredis";
import 'dotenv/config';

const redisClient = new Redis(
  {
    host: process.env.REDIS_HOST,
    port: 6379,
    password: process.env.REDIS_PASSWORD
  }
);
redisClient.on("connect", () => {console.log("Connected to Redis cache successfully.")})

redisClient.on('error', (err: Error) => {
  console.error('Redis Client Error:', err);
});

export default redisClient;