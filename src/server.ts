/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

// Fastify stuff.
import fastify, { FastifyInstance, FastifyRequest } from "fastify"
import fastifyStatic from "@fastify/static"

// WebSocket stuff.
import { AshleyWebSockets } from "./websocket.ts"

// Node stuff.
import path from "node:path"
import { fileURLToPath } from "node:url"
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Essentials for rendering pages.
import { Session } from "./session.ts"
import { BaseLogger, ConsoleLogger } from "./logger.ts"
import Configuration from "./configuration.ts"
import render from "./pages/Render.tsx" //

// Page templates.
import Index from "./pages/Index.tsx"

export class AshleyServer {
  instance: FastifyInstance
  ws: AshleyWebSockets
  config: Configuration
  log: BaseLogger

  async session(req: FastifyRequest): Promise<Session | undefined> {
    // TODO: implement lol

    return undefined
  }

  async page(
    type: "index" | "thread" | "category" | "settings" | "modcp" | "admincp",
    session?: Session
  ) {
    if (type === "index") {
      return await render(
        Index,
        { config: this.config, logger: this.log },
        session
      )
    }
  }

  async start() {
    this.instance.get("/", async (request, reply) => {
      this.log.log("dbg", `GET /`)
      reply
        .code(200)
        .header("Content-Type", "text/html; charset=utf-8")
        .send(await this.page("index", await this.session(request)))
    })

    this.instance.listen({ port: this.config.port })
    this.log.log("info", `Listening on port ${this.config.port}.`)
  }

  constructor(config: Configuration) {
    this.config = config

    this.instance = fastify() //

    // WebSockets. Currently only used for debug but
    // we could use it in the future for things like
    // notifications.
    this.ws = new AshleyWebSockets(this.config.port + 1, this.config.debug)

    // TODO: Maybe setup CDN or some shit.
    this.instance.register(fastifyStatic, {
      root: path.join(__dirname, "static"),
    })

    // Setup logger.
    // TODO: File logs. For now, default to console.
    this.log = new ConsoleLogger(false, config.debug)
  }
}

export default AshleyServer
