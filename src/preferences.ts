/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
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
