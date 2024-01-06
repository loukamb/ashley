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
