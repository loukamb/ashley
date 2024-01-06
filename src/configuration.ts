/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

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

  // Log configuration.
  readonly log:
    | "silent"
    | "console"
    | {
        readonly type: "silent" | "console" | "file"
        readonly file?: string
      }

  // Parsed arguments.
  readonly args: Record<string, string | boolean>
}

export async function loadconf(
  path: string,
  args: Record<string, string | boolean>
) {
  let configRaw: string | undefined

  try {
    configRaw = await fs.readFile(path, "utf-8")
  } catch {
    // An error has occured, log it but move on in debug mode.
    if (args.debug) {
      console.debug(
        "<ashley-loadconf> In debug mode. Default configuration will be used."
      )
    } else {
      console.error(
        "<ashley-loadconf> Configuration is missing. Either create an empty 'ashley.config.json' in this directory, or pass a configuration filepath to '--config'."
      )
      process.exit(1)
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

  if (
    typeof config.log === "object" &&
    config.log.type === "file" &&
    typeof config.log.file !== "string"
  ) {
    throw new Error("'config.log.file' is not a valid path.")
  }

  return config
}

export default Configuration
