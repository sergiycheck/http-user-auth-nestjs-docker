import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { LRUCache } from 'lru-cache';
import { Observable, map, of } from 'rxjs';

// for the sake of the example, we are using a simple in-memory cache
// to demonstrate the concept of using interceptors to cache responses

const options = {
  max: 500,
  ttl: 1000 * 60 * 5,

  allowStale: false,

  updateAgeOnGet: false,
  updateAgeOnHas: false,
};

const cache = new LRUCache(options);

@Injectable()
export class CacheRequestGetInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const key = request.url;

    const isCached = cache.has(key);
    if (isCached) {
      const value = cache.get(key);
      return of(value);
    }
    return next.handle().pipe(
      map((response) => {
        cache.set(key, response);
        return response;
      }),
    );
  }
}
