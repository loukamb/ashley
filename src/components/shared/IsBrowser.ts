/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 06/01/2024
 */

/**
 * Check if we are running inside a browser. Not necessary with `useEffect`, but
 * may be used in other cases. Voodo ifdef preprocessing used for optimization.
 */

function isBrowser_force_true() {
  return true
}

function isBrowser_force_false() {
  return false
}

// prettier-ignore
export default (
  /// #ifdef false
  true
  ?
  /// #endif
  /// #ifdef BROWSER
  isBrowser_force_true
  /// #endif
  /// #ifdef false
  :
  /// #endif
  /// #ifdef !BROWSER
  isBrowser_force_false
  /// #endif
)
