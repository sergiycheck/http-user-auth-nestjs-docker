import { LRUCache } from 'lru-cache';

// for the sake of the example, we are using a simple in-memory cache
// to demonstrate the concept of using interceptors to cache responses

const options = {
  max: 500,
  ttl: 1000 * 60 * 5,

  allowStale: false,

  updateAgeOnGet: false,
  updateAgeOnHas: false,
};

export const LRUCacheInstance = new LRUCache(options);
