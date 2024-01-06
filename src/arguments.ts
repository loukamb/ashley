/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

/**
 * Matches the following:
 * --arg
 * --arg-arg
 * --arg=1
 * --arg-arg=1
 * --arg=Hello
 * --arg-arg=Hello
 * BROKEN FOR SOME REASON:
 * --arg="Hello world!"
 * --arg-arg="Hello world!"
 */
const argregex = /\-\-([\w-]+)(?:=(?:"([^"]+)"|([^\s]+)))?/

export default function parseargs() {
  const obj: Record<string, string> = {}

  const args = [...process.argv]
  args.shift()
  args.shift()

  for (const arg of process.argv) {
    if (arg.startsWith("--")) {
      const matches = arg.match(argregex)
      if (matches !== null) {
        matches.shift() // Remove the match value.
        obj[matches[0]] = matches[2] ?? true
      }
    }
  }

  return obj
}
