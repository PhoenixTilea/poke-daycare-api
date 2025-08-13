import {ServiceIdentifier} from "inversify";

export type PayloadFunc<T> = () => Promise<T>;
// To cache things by multiple identifiers
export type MultiKeysFunc<T> = (val: T) => string[];

export interface ICachingService {
  cached<T>(key: string, payloadFunc: PayloadFunc<T>, multiKeysFunc?: MultiKeysFunc<T>): Promise<T>;
}

export const cachingServiceId: ServiceIdentifier<ICachingService> = Symbol.for("CachingServiceId");