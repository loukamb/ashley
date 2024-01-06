/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

/**
 * Object representing a user's logged-in session.
 * Data is encrypted and inaccessible to the client.
 */
export interface Session {
  /**
   * Id of user (uuid), as found in database.
   */
  readonly id: string

  /**
   * Unix time of when this session was created.
   */
  readonly createdAt: number

  /**
   * Unix time of when this session expires.
   */
  readonly expiresAt: number
}
