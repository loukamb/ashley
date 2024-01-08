/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 06/01/2024
 */

import { Thread } from "./thread.ts"
import { Session } from "@/server/session.ts"

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

/**
 * Retrieve section information for specified ID. Pass `threads` with an object
 * defining `page` and `count` to get # of threads for page in this section. Returns undefined
 * if the section ID does not exist or is private (in that case you should 404 the user).
 * If no session is passed, only publicly-viewable sections will be retrieved.
 */
export async function getSection(
  id: number,
  session?: Session,
  threads?: { page: number; count: number }
): Promise<Section | undefined> {
  // TODO: Implement.

  return undefined
}

/**
 * Retrieve default sections, viewable on the index. Does not retrieve threads!
 * If no session is passed, only publicly-viewable sections will be retrieved.
 */
export async function getIndexSections(session?: Session) {
  // TODO: Implement.

  return [
    {
      id: "-1",
      name: "Lorem Ipsum",
      description: "This is a debug section to test layout. Does not exist!",
      color: "#ff0000",
      icon: "fluent:bug-20-regular",
    },

    {
      id: "-2",
      name: "Dolor Ameit",
      description: "This is a debug section to test layout. Does not exist!",
      color: "#ffff00",
      icon: "fluent:emoji-smile-slight-20-regular",
    },

    {
      id: "-3",
      name: "Foo Bar",
      description: "This is a debug section to test layout. Does not exist!",
      color: "#ffffff",
      icon: "fluent:emoji-laugh-20-regular",
    },
  ] as Section[]
}
