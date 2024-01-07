/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import { Session } from "@/server/session.ts"
import { BaseLogger } from "@/logger.ts"

import { HelmetContext } from "../Helmet.tsx"

import Configuration from "@/config.ts"
import Layout from "./Layout.tsx"

import { ComponentChildren, JSX } from "preact"
import { renderToString } from "preact-render-to-string"

export type AshleyPageComponent = (params: {
  session?: Session
  params: any
}) => Promise<ComponentChildren>

export default async function render<T extends AshleyPageComponent>(
  Page: T,
  params: {
    config: Configuration
    logger: BaseLogger
  } & (Parameters<T>[1] extends undefined ? {} : Parameters<T>[1]),
  session?: Session
) {
  // Prepare helmet and reporter.
  const helmet = [] as ComponentChildren[]
  const reporter = (contents: ComponentChildren) => helmet.push(contents)

  // HACK: Double work, but implements reliable & fast context in async SSR. If someone has
  // a better solution that isn't racey and doesn't rely on AsyncLocalStorage, please let me know.
  let torender: JSX.Element
  await HelmetContext.enter(reporter, async () => {
    const contents = renderToString(
      (await Page({ session, params })) as JSX.Element
    )
    torender = await Layout({ session, params, helmet, contents })
  })

  return renderToString(torender!)
}
