/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 06/01/2024
 */

import { AshleyServer } from "./server.ts"

type ResourceRetriever = (id: string, params?: any) => Promise<any>
type ResourceRetrieverSet = (retriever: ResourceRetriever) => void

export class AshleyResources {
  readonly server: AshleyServer

  private _resmap: Record<
    string,
    [lookup: ResourceRetriever, cachehit: ResourceRetriever | undefined]
  > = {}

  /**
   * Invoke `onLookup` with the function used to obtain an object from the database.
   * Invoke `onCacheHit` with the function used to obtain an object from the cache.
   * Whether `onLookup` or `onCacheHit` is called depends entirely on server behavior.
   * `onCacheHit` is optional but a warning will be thrown at runtime if it isn't
   * invoked with a resource retriever.
   */
  define(
    name: string,
    setup: (
      onLookup: ResourceRetrieverSet,
      onCacheHit: ResourceRetrieverSet
    ) => void
  ) {
    let lookupRetriever: ResourceRetriever | undefined
    let cacheHitRetriever: ResourceRetriever | undefined
    const registerLookup = (retriever: ResourceRetriever) =>
      (lookupRetriever = retriever)
    const registerCacheHit = (retriever: ResourceRetriever) =>
      (cacheHitRetriever = retriever)
    setup(registerLookup, registerCacheHit)

    if (lookupRetriever === undefined) {
      throw new Error("Each resource must have a database lookup retriever.")
    }

    if (cacheHitRetriever === undefined) {
      this.server.log.log(
        "warn",
        `Resource "${name}" does not have a cache hit retriever.`
      )
    }

    this._resmap[name] = [lookupRetriever, cacheHitRetriever]
  }

  /**
   * Retrieves a resource.
   */
  async get<T>(name: string, id: string, params?: any) {
    const getters = this._resmap[name]
    if (name === undefined) {
      throw new Error(`Resource "${name}" does not exist.`)
    }

    let shouldHitTheCache: boolean

    // Do we have a cache hitter? If not, let's already not hit the cache.
    if (getters[1] === undefined) {
      shouldHitTheCache = false
    } else {
      // TODO: Figure out if the value exists in the cache.
      // If value exists, check if we have exceeded TTL.
      // If value doesn't exist, hit database.
      // If value exists and we haven't exceeded TTL, hit cache.
      // If value exists but we have exceeded TTL, hit database.
      // Every time we hit the database, update the value in
      // the cache and update TTL accordingly.
      shouldHitTheCache = false
    }

    if (shouldHitTheCache) {
      // "getters[1]" guaranteed to exist.
      return await getters[1]!(id, params)
    } else {
      // Hit the database.
      const value = await getters[0](id, params)

      // TODO: Update the cache and TTL here.

      return value
    }
  }

  constructor(server: AshleyServer) {
    this.server = server
  }
}

/**
 * Utility function for loading in basic resources.
 */
export function loadBasicResources(resources: AshleyResources) {
  resources.define("announcements", (onLookup, onCacheHit) => {
    onLookup(async (id, params) => {
      // TODO: Implement.
    })
  })
}
