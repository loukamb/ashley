/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 06/01/2024
 */

export interface Announcement {
  /**
   * ID of the announcement.
   */
  readonly id: string

  /**
   * Contents of the announcement.
   */
  readonly contents: string

  /**
   * Do we have a link?
   */
  readonly href?: string

  /**
   * Color of the announcement? Defaults to a background shade.
   */
  readonly color?: string
}

/**
 * Get the announcements for either the index page or a section page.
 */
export async function getAnnouncements(type: "index" | "section", id?: string) {
  // TODO: Retrieve announcements from the database. For now,
  // let's return some placeholders.
  return [
    {
      id: "0",
      contents:
        "Ashley is a work-in-progress. You should use this as nothing more than a toy for now.",
    },
  ] as readonly Announcement[]
}
