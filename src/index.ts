/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import AshleyServer from "./server.ts"

import parseargs from "./arguments.ts"
import { loadconf } from "./configuration.ts"

/**
 * Nominally unnecessary since we're a module, but the
 * environment can be unpredictable.
 */
async function main() {
  // Parse arguments.
  const args = parseargs()

  // Load the configuration file.
  const config = await loadconf(args.config ?? "./ashley.config.json", args)

  const server = new AshleyServer(config)

  // Let's go!
  await server.start()
}

main().catch(console.error)
