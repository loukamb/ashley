/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import { Session } from "@/server/session.ts"
import { BaseLogger } from "@/logger.ts"

import { HelmetContext } from "../Helmet.tsx"
import { SonataContext } from "../ssr/Sonata.tsx"
import {
  SonataComponentProperties,
  SonataConfig,
} from "../ssr/SonataProperties.tsx"

import { createAsyncContextComposite } from "../AsyncComposite.tsx"

import Configuration from "@/config.ts"
import { ReadonlyPreferences } from "@/server/preferences.ts"
import Layout from "./Layout.tsx"

import { ComponentChildren, JSX } from "preact"
import { renderToString } from "preact-render-to-string"

export type AshleyPageComponent = (params: {
  session?: Session
  params: any
}) => Promise<ComponentChildren>

/**
 * Async context composite for helmet and sonata.
 */
export const RenderContextComposite = createAsyncContextComposite(
  HelmetContext,
  SonataContext
)

export default async function render<T extends AshleyPageComponent>(
  Page: T,
  params: {
    prefs: ReadonlyPreferences
    config: Configuration
    logger: BaseLogger
  } & (Parameters<T>[1] extends undefined ? {} : Parameters<T>[1]),
  session?: Session
) {
  // Prepare helmet and reporter.
  const helmet = [] as ComponentChildren[]
  const helmetReporter = (contents: ComponentChildren) => helmet.push(contents)

  // Prepare sonata props.
  const sonata: SonataConfig = {}
  const sonataReporter = (name: string, props: SonataComponentProperties) =>
    (sonata[name] = props)

  // HACK: Double work, but implements reliable & fast context in async SSR. If someone has
  // a better solution that isn't racey and doesn't rely on AsyncLocalStorage, please let me know.
  let renderedHtml: string
  await RenderContextComposite.enter(
    [helmetReporter, sonataReporter],
    async () => {
      const contents = renderToString(
        (await Page({ session, params })) as JSX.Element
      )
      const torender = await Layout({
        session,
        params,
        helmet,
        sonata,
        contents,
      })
      renderedHtml = renderToString(torender)
    }
  )
  return renderedHtml!
}
