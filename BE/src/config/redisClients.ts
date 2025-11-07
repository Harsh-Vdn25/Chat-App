import { createClient } from "redis"

export const redisClients=[
  createClient({url:'redis://localhost:6379'}),
  createClient({url:'redis://localhost:6380'})
]