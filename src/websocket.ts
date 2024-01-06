/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import { Session } from "./session.ts"
import { AshleyPacket } from "./shared/AshleyPacket.ts"

import { IncomingMessage } from "node:http"
import WebSocket, { WebSocketServer } from "ws"

interface AshleyWebSocket {
  socket: WebSocket

  // Pre-parsed session.
  session?: Session
}

export class AshleyWebSockets {
  /**
   * Current connections.
   */
  connections: AshleyWebSocket[]

  /**
   * Server for web sockets.
   */
  server: WebSocketServer

  /**
   * Are we running in debug?
   */
  readonly debug: boolean

  onMessage(socket: AshleyWebSocket, packet: AshleyPacket) {}

  onConnection(socket: WebSocket, request: IncomingMessage) {
    // TODO: Get session from request. For now, let's just create the AshleyWebsocket.
    // Future note: Users _must_ have a session for websockets to be accepted (unless in
    // debug mode but this is obvious)
    const ashleyws = { socket, session: undefined }
    this.connections.push(ashleyws)

    socket.on("message", (data, isbinary) => {
      console.log(data)
      // TODO: Encoding and schema validation.
      const parsed = JSON.parse(data.toString()) as AshleyPacket
      this.onMessage(ashleyws, parsed)
    })

    // TODO: Check if racey.
    socket.on("close", () => {
      const idx = this.connections.findIndex((v) => v.socket === socket)
      if (idx > -1) {
        this.connections.splice(idx, 1)
      }
    })
  }

  constructor(port: number, debug?: boolean) {
    this.connections = []
    this.server = new WebSocketServer({ port })
    this.debug = debug ?? false
    this.server.on("connection", (socket, msg) => {
      if (this.debug) {
        const cmd = msg.headers["command"]
        if (cmd !== undefined) {
          if (cmd === "debug-kill") {
            // Kill ourselves
            process.exit(0)
            return
          }
        }
      }

      this.onConnection(socket, msg)
    })
  }
}
