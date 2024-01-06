/**
 * Content driver interface.
 */

export interface Contents {
  /**
   * If this bbcode or markdown?
   */
  readonly type: "bbcode" | "md"

  /**
   * This is the unparsed contents.
   */
  readonly contents: string

  /**
   * This is the cached contents.
   */
  readonly pcontents: string
}

/**
 * Retrieve content data from content id. This may result in a cache hit,
 * pass `nocache` if you deliberately want to avoid cache.
 */
export async function getContents(id: string, nocache?: boolean) {
  // TODO
}
