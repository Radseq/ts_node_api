import { createClient } from 'redis'

let redisClientPromise: Promise<ReturnType<typeof createClient>> | null = null

export function getCache(): Promise<ReturnType<typeof createClient>> {
    if (!redisClientPromise) {
        redisClientPromise = new Promise((resolve, reject) => {
            const redisClient = createClient()
            redisClient.on('error', err => reject(err))
            redisClient.on('connect', () => console.log('Redis connecting'))
            redisClient.on('reconnecting', () => console.log('Redis reconnecting'))
            redisClient.on('ready', () => resolve(redisClient))
            redisClient.connect()
        })
    }
    return redisClientPromise;
}