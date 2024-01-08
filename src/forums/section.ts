/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 06/01/2024
 */

import { Thread } from "./thread.ts"

export interface Section {
  /**
   * ID of section. `/section/{id}`
   */
  readonly id: string

  /**
   * Name of section.
   */
  readonly name: string

  /**
   * Color of section. Optional.
   */
  readonly color?: string

  /**
   * Description of section. Optional.
   */
  readonly description?: string

  /**
   * Icon for this section. This value depends on the icon driver
   * configured in preferences. Optional.
   */
  readonly icon?: string

  /**
   * Children sections. Optional, must be joined in the db query.
   */
  readonly sections?: Section[]

  /**
   * Sticky threads. Optional, must be joined in the db query.
   */
  readonly stickies?: Thread[]

  /**
   * Threads contained in this section. Must be joined in the db query.
   */
  readonly threads?: Thread[]
}
