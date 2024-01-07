/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import { promises as fs } from "node:fs"
import { spawn } from "node:child_process"

import esbuild from "esbuild"
import esbuildPluginIfdef from "./build-ifdef.mjs"
import chokidar from "chokidar"
import { WebSocket } from "ws"

import postcss from "postcss"
import psass from "@csstools/postcss-sass"
import cssnano from "cssnano"
import autoprefixer from "autoprefixer"

const templates = {
  server: {
    entryPoints: ["./src/index.ts"],
    outdir: "./dist",
    format: "esm",
    platform: "node",
    packages: "external",
    bundle: true,
  },

  client: {
    entryPoints: ["./src/client/index.ts"],
    outdir: "./dist/static/",
    format: "esm",
    platform: "browser",
    bundle: true,
  },
}

/**
 * Prepare static assets.
 */
async function staticassets() {
  // Prepare folder.
  try {
    await fs.mkdir("./dist/static", { recursive: true })
  } catch {}

  // Build & write CSS.
  const r = await postcss([
    psass(),
    autoprefixer(),
    cssnano({ preset: "default" }),
  ]).process(await fs.readFile("./src/styles/root.scss"), {
    from: "./src/styles/root.scss",
    to: "./dist/static/theme.css",
  })
  await fs.writeFile("./dist/static/theme.css", r.css, "utf-8")
}

async function build() {
  // Prepare static assets.
  await staticassets()

  // Build code.
  await esbuild.build({
    ...templates.server,
    plugins: [esbuildPluginIfdef({ variables: { BROWSER: false } })],
  })

  await esbuild.build({
    ...templates.client,
    plugins: [esbuildPluginIfdef({ variables: { BROWSER: true } })],
  })
}

async function watch() {
  let hasBeenCreated = false

  const server = () => {
    const proc = spawn("node", ["./dist/index.js", "--debug"], {
      stdio: "inherit",
    })
    proc.on("close", () => {
      console.log("/!\\ Debug server restart!")
      server()
    })
  }

  const notify = {
    name: "rebuild-notify",
    setup(build) {
      build.onEnd((results) => {
        if (results.errors.length > 0) {
          for (const err of results.errors) {
            console.error(err)
          }
          return // No.
        }

        try {
          // WS port during debug is 8082.
          const ashleyWsServer = new WebSocket("ws://localhost:8082", {
            headers: { command: "debug-kill" },
          })
          ashleyWsServer.onerror = () => {}
        } catch {}

        if (!hasBeenCreated) {
          hasBeenCreated = true

          // Prepare static assets.
          staticassets()

          server()
        }
      })
    },
  }

  // Setup watch to automatically compile static assets when they change.
  chokidar
    .watch("./src/styles", { ignoreInitial: true })
    .on("all", () => staticassets())

  const serverContext = await esbuild.context({
    ...templates.server,
    plugins: [notify, esbuildPluginIfdef({ variables: { BROWSER: false } })],
  })

  const clientContext = await esbuild.context({
    ...templates.client,
    plugins: [notify, esbuildPluginIfdef({ variables: { BROWSER: true } })],
  })

  await Promise.all([serverContext.watch(), clientContext.watch()])
}

;(process.argv.includes("dev") ? watch : build)().catch(console.error)
