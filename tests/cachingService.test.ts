import Cache from "node-cache";
import CachingService from "../src/services/cachingService";

describe("CachingService", () => {
  const cache = new Cache();
  const service = new CachingService(cache);

  beforeEach(() => {
    // Insert toilet emoji
    cache.flushAll();
  });

  it("Should cache the value by the given key.", async () => {
    const payloadFunc = jest.fn().mockReturnValue(Promise.resolve("Hai there!"));
    const result = await service.cached("greeting", payloadFunc);
    expect(result).toBe("Hai there!");
    expect(cache.get("greeting")).toBe("Hai there!");
    expect(payloadFunc.mock.calls).toHaveLength(1);
  });
  it("Should return value if already cached.", async () => {
    cache.set("greeting", "Hai there!");
    const payloadFunc = jest.fn();

    const result = await service.cached("greeting", payloadFunc);
    expect(result).toBe("Hai there!");
    expect(payloadFunc.mock.calls).toHaveLength(0);
  });
  it("Should cache a value by multiple keys if multiKeysFunc is provided.", async () => {
    const payloadFunc = jest.fn().mockReturnValue(Promise.resolve("Hai there!"));
    const multiKeysFunc = jest.fn().mockReturnValue(["greeting", "dumb_greeting"]);

    await service.cached("greeting", payloadFunc, multiKeysFunc);
    expect(multiKeysFunc.mock.calls).toHaveLength(1);
    expect(cache.get("greeting")).toBe("Hai there!");
    expect(cache.get("dumb_greeting")).toBe("Hai there!");
  });
});
