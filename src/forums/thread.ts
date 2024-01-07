/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 06/01/2024
 */

export interface Thread {
  /**
   * ID of thread. `/thread/{id}`
   */
  readonly id: string

  /**
   * Thread title.
   */
  readonly title: string
}
