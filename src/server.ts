/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

// Fastify stuff.
import fastify, { FastifyInstance, FastifyRequest } from "fastify"
import fastifyStatic from "@fastify/static"

// WebSocket stuff.
import { AshleyWebSockets } from "./websocket.ts"

// Resource stuff.
import { AshleyResources, loadBasicResources } from "./resources.ts"

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
  resources: AshleyResources
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

  constructor(config: Configuration, log?: BaseLogger) {
    this.config = config
    this.log = log ?? new BaseLogger()

    // Setup the database.
    // TODO: Actually setup the database.

    // Setup the cache.
    // TODO: Actually setup the cache.

    // Setup resources.
    this.resources = new AshleyResources(this)
    loadBasicResources(this.resources)

    // WebSockets. Currently only used for debug but
    // we could use it in the future for things like
    // notifications.
    this.ws = new AshleyWebSockets(this.config.port + 1, this.config.debug)

    // Setup the instance.
    this.instance = fastify()

    // TODO: Maybe setup CDN or some shit.
    this.instance.register(fastifyStatic, {
      root: path.join(__dirname, "static"),
    })
  }
}

export default AshleyServer
