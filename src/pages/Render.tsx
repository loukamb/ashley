/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import { Session } from "../session.ts"
import { BaseLogger } from "../logger.ts"
import Configuration from "../configuration.ts"
import Layout from "./Layout.tsx"

import React from "react"
import ReactDOMServer from "react-dom/server"

export type AshleyPageComponent = (params: {
  session?: Session
  params: any
}) => Promise<React.ReactNode>

export default async function render<T extends AshleyPageComponent>(
  Page: T,
  params: {
    config: Configuration
    logger: BaseLogger
  } & (Parameters<T>[1] extends undefined ? {} : Parameters<T>[1]),
  session?: Session
) {
  const page = await Page({ session, params })
  const layout = await Layout({ session, params, children: page })
  return ReactDOMServer.renderToString(layout)
}
