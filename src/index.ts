/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import AshleyServer from "./server.ts"
import { ConsoleLogger } from "./logger.ts"
import { parseargs } from "./arguments.ts"
import { loadconf } from "./configuration.ts"

/**
 * Nominally unnecessary since we're a module, but the
 * environment can be unpredictable.
 */
async function main() {
  // Create the logger.
  const logger = new ConsoleLogger(false, true)

  // Parse arguments.
  const args = parseargs()

  // Load the configuration file.
  let config
  try {
    config = await loadconf(args.config ?? "./ashley.config.json", args, logger)
  } catch (exc) {
    const msg = (exc as Error).message
    logger.log("error", msg)
    process.exit(1)
  }

  const server = new AshleyServer(config, logger)

  // Let's go!
  try {
    await server.start()
  } catch (exc) {
    logger.log("error", "A critical error has occured. Trace to follow.")
    logger.log("error", (exc as Error).toString())
    process.exit(1)
  }
}

main().catch(console.error)
