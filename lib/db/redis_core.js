import { createClient } from 'redis';
import config from "config";
import {log} from "../utils/api_log.js";

export const redisClient = createClient(config.get("redisConfig"));

redisClient.on('error', (err) =>{
    log.error('redis client err:', err);
    redisClient.quit();
})

await redisClient.connect();