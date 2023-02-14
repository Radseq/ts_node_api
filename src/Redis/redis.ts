import type { RedisClientType } from 'redis'
import { createClient } from 'redis'

let redisClient: RedisClientType | null
let isReady: boolean

export const getCache = () => {
    if (!isReady) {
        redisClient = createClient()
        redisClient.on('error', err => console.log(`Redis Error: ${err}`))
        redisClient.on('connect', () => console.log('Redis connected'))
        redisClient.on('reconnecting', () => console.log('Redis reconnecting'))
        redisClient.on('ready', () => {
            isReady = true
            console.log('Redis ready!')
        })
        redisClient.connect();
    }
    return redisClient;
}