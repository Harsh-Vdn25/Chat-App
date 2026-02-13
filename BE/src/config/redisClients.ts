import { createClient } from "redis"
import { requiredInfo } from "./utils";

export const redisClient = createClient({url:requiredInfo.REDIS_URL});