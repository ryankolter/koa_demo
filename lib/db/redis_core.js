import { createClient } from 'redis';
import config from "config";
import { Log } from "../utils/api_log.js";
const log = new Log("redis_core");

export const redisClient = createClient(config.get("redisConfig"));

redisClient.on('error', (err) =>{
    log.error('redis client err:', err);
    redisClient.quit();
})

await redisClient.connect();