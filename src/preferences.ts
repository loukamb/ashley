/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

/**
 * Preferences are configurable website settings that exist outside of the
 * `ashley.config.json` file. Almost every site parameter must depend on these
 * preferences for convenience. Preferences also are not resources, and while they
 * are both subject to caching, they are stored differently and therefore have their
 * own business logic for retrieval/caching/TTL.
 */

export class Preferences {
  /**
   * Retrieve configuration `name` from database. If `nocache` is set, it forcefully
   * retrieves the configuration value from the database without a cache hit.
   */
  async get<T>(name: string, nocache?: boolean): Promise<T> {
    let value: T

    // TODO: Retrieve preference from database/cache.
    value = undefined as unknown as T

    return value
  }

  /**
   * Sets configuration `name` to `value` in database. This will also
   * update the value in the cache.
   */
  async set<T>(name: string, value: T) {}
}

export default Preferences
