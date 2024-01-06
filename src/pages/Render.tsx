/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import { Session } from "../session.ts"
import { BaseLogger } from "../logger.ts"
import {
  enterUniqueContext,
  useUniqueContext,
} from "../components/UniqueContext.tsx"
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
  // Prepare helmet and reporter.
  const helmet = [] as React.ReactNode[]
  const reporter = (contents: React.ReactNode) => helmet.push(contents)

  // HACK: Double work, but implements reliable & fast context in async SSR. If someone has
  // a better solution that isn't racey and doesn't rely on AsyncLocalStorage, please let me know.
  let torender: JSX.Element
  await enterUniqueContext(
    async () => {
      const contents = ReactDOMServer.renderToString(
        (await Page({ session, params })) as JSX.Element
      )
      torender = await Layout({ session, params, helmet, contents })
    },
    { helmet: reporter }
  )
  return ReactDOMServer.renderToString(torender!)
}
