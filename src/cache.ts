import { getCache } from "./Redis/redis";

export const getCacheData = async (key: string) => {
    const redis = await getCache();
    if (redis) {
        const value = await redis.get(key)
        if (value) {
            return JSON.parse(value);
        }
    }
    return null;
}

export const setCacheData = async (key: string, value: any,
    ttlInSeconds: number | null = null) => {
    const redis = await getCache();
    if (redis) {
        await redis.set(key, JSON.stringify(value));
        if (ttlInSeconds) {
            redis.expire(key, ttlInSeconds)
        }
    }
}