/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 06/01/2024
 */

/**
 * Check if we are running inside a browser. Not necessary with `useEffect`, but
 * may be used in other cases.
 */
export default function isBrowser() {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  )
}
