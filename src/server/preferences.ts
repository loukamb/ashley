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

/**
 * Simple object listing all possible preferences.
 */
export interface ReadonlyPreferences {
  /**
   * If defined, the "Rules" link will appear in the header.
   */
  rules?: string
}

export type PreferenceNames = keyof ReadonlyPreferences

export class Preferences {
  /**
   * Retrieve configuration `name` from database. If `nocache` is set, it forcefully
   * retrieves the configuration value from the database without a cache hit.
   */
  async get(
    name: PreferenceNames,
    nocache?: boolean
  ): Promise<ReadonlyPreferences[typeof name]> {
    let value: ReadonlyPreferences[typeof name]

    // TODO: Retrieve preference from database/cache.
    value = undefined as unknown as typeof value

    return value
  }

  /**
   * Sets configuration `name` to `value` in database. This will also
   * update the value in the cache.
   */
  async set(name: PreferenceNames, value: ReadonlyPreferences[typeof name]) {}
}

/**
 * DEBUG ONLY: Debug preferences for testing.
 */

export const _debugPreferences: ReadonlyPreferences = {
  rules: "/link-to-rules",
}

export default Preferences
