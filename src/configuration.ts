/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import { BaseLogger } from "./logger.ts"

import { promises as fs } from "node:fs"

export interface Configuration {
  /**
   * Name of website.
   */
  readonly name: string

  /**
   * Description. Optional.
   */
  readonly description?: string

  /**
   * Port to run on. Can also be specified with `--port`.
   */
  readonly port: number

  // Are we in debug mode?
  readonly debug: boolean

  // Parsed arguments.
  readonly args: Record<string, string | boolean>
}

export async function loadconf(
  path: string,
  args: Record<string, string | boolean>,
  logger?: BaseLogger
) {
  let configRaw: string | undefined

  try {
    configRaw = await fs.readFile(path, "utf-8")
  } catch {
    // An error has occured, log it but move on in debug mode.
    if (args.debug) {
      logger?.log("dbg", "In debug mode. Default configuration will be used.")
    } else {
      throw new Error(
        "Configuration is missing. Either create an empty 'ashley.config.json' in this directory, or pass a configuration filepath to '--config'."
      )
    }
  }

  const config = Object.assign(
    {
      name: "Ashley",
      description: "Congratulations, your forum is working!",
      log: "console",
      port: args.port ? parseInt(args.port as string) : 8081,
      debug: args.debug ?? false,
    },
    configRaw ? JSON.parse(configRaw) : {}
  ) as Configuration

  if (isNaN(config.port)) {
    throw new Error(
      "'config.port' is NaN. Either your configuration file or --port argument has a non-number value."
    )
  }

  return config
}

export default Configuration
