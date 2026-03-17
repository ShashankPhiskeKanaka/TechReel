import { client } from "../caching/redis.client.js";
import { CacheMiddlewareClass } from "../caching/redis.middleware.js";

class CacheFactory {
    static create (client: any) {
        const cacheMiddleware = new CacheMiddlewareClass(client);

        return cacheMiddleware;
    }
} 

const cacheMiddleware = CacheFactory.create(client);

export { CacheFactory, cacheMiddleware }