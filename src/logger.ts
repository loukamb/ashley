/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import chalk from "chalk"

import SafeEventEmitter from "./emitter.ts"

export type LogLevel = "info" | "warn" | "error" | "dbg"

type LoggerEmitter = {
  message: (level: LogLevel, message: string) => void
}

export class BaseLogger {
  /**
   * Are we running in debug mode?
   */
  readonly debug: boolean

  /**
   * Are we silent? Note that 'dbg' loglevel is still
   * printed if debug is true.
   */
  readonly silent: boolean

  /**
   * Event emitter.
   */
  readonly events: SafeEventEmitter<LoggerEmitter>

  /**
   * Log. Nuff said.
   */
  log(level: LogLevel, message: string) {
    if (!this.silent || (level === "dbg" && this.debug)) {
      this.events.discard_emit("message", level, message)
    }
  }

  constructor(silent?: boolean, isDebugMode?: boolean) {
    this.silent = silent ?? false
    this.debug = isDebugMode ?? false
    this.events = new SafeEventEmitter()
  }
}

export class ConsoleLogger extends BaseLogger {
  constructor(silent?: boolean, isDebugMode?: boolean) {
    super(silent, isDebugMode)
    this.events.on("message", (level, message) => {
      if (level === "info") {
        console.info(`<ashley> ${chalk.green(message)}`)
      } else if (level === "warn") {
        console.log(`<ashley> ⚠️ ${chalk.yellowBright(message)}`)
      } else if (level === "error") {
        console.log(`<ashley> ❌ ${chalk.redBright(message)}`)
      } else if (level === "dbg") {
        console.log(`<ashley> ⚙️ ${chalk.blueBright(message)}`)
      }
    })
  }
}

// TODO: File logger.
