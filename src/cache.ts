import { redisClient } from "./Redis/redis";

const cache = redisClient;

export const getCacheData = async (key: string) => {
    const cacheData = await cache.get(key);
    if (cacheData) {
        return JSON.parse(cacheData);
    }
    return null;
}

export const setCacheData = async (key: string, value: any, ttlInSecunds: number | null = null) => {
    await cache.set(key, JSON.stringify(value));
    if (ttlInSecunds) {
        cache.expire(key, ttlInSecunds)
    }
}