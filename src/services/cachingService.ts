import { inject, injectable, ServiceIdentifier } from "inversify";
import type Cache from "node-cache";
import type {
  ICachingService,
  MultiKeysFunc,
  PayloadFunc,
} from "../contracts/iCachingService";

export const cacheId: ServiceIdentifier<Cache> = Symbol.for("CacheId");

@injectable()
export default class CachingService implements ICachingService {
  constructor(
    @inject(cacheId)
    private readonly _cache: Cache,
  ) {}

  public cached = async <T>(
    key: string,
    payloadFunc: PayloadFunc<T>,
    multiKeysFunc?: MultiKeysFunc<T>,
  ): Promise<T> => {
    const cachedValue = this._cache.get(key) as T | undefined;
    if (cachedValue) {
      return cachedValue;
    }

    const value = await payloadFunc();
    if (multiKeysFunc) {
      const keys = multiKeysFunc(value);
      this._cache.mset(keys.map(k => ({ key: k, val: value })));
    } else {
      this._cache.set(key, value);
    }

    return value;
  };
}
