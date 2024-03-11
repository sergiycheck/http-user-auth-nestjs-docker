import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map, of } from 'rxjs';
import { LRUCacheInstance } from 'src/infra/cache/lru.cache';

@Injectable()
export class CacheRequestGetInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const key = request.url;

    const isCached = LRUCacheInstance.has(key);
    if (isCached) {
      const value = LRUCacheInstance.get(key);
      return of(value);
    }
    return next.handle().pipe(
      map((response) => {
        LRUCacheInstance.set(key, response);
        return response;
      }),
    );
  }
}
