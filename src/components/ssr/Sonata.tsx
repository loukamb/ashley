/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 07/01/2024
 */

/**
 * Sonata is a system for rendering server-sided components, then partially
 * hydrating them on the client. It replaces the legacy Aqueduct architecture.
 */

import { FunctionComponent } from "preact"

import isBrowser from "../shared/IsBrowser.ts"

/// #ifdef !BROWSER
import { RenderContextComposite } from "@/server/render.ts"
import {
  createAsyncContextSegment,
  useAsyncContextComposite,
} from "./AsyncComposite.tsx"

import SonataAqueduct from "./SonataAqueduct.tsx"
import { SonataComponentProperties } from "./SonataProperties.tsx"

/**
 * Function that reports to the context which parameters need to be passed
 * down to the client.
 */
type SonataReporter = (
  name: string,
  params: SonataComponentProperties
) => number

/**
 * Used to store the current reporter.
 */
export const SonataContext = createAsyncContextSegment<
  SonataReporter | undefined
>("sonata-context")
/// #endif

/**
 * Wrap your component with this.
 */
export function Sonata<Props extends object>(
  component: FunctionComponent<Props>
) {
  return {
    [component.name](props: Props) {
      // No need to do Sonata bullshit on the client.
      /// #ifdef BROWSER
      if (isBrowser()) {
        return component(props)
      }
      /// #else
      const useAsyncContext = useAsyncContextComposite(RenderContextComposite)
      const sonataReporter = useAsyncContext(SonataContext) as SonataReporter
      if (sonataReporter === undefined) {
        throw new Error(
          "SonataReporter is missing. Component will not be hydratable on the client."
        )
      }

      // Retrieve ID for this component.
      const allocId = sonataReporter(
        component.name,
        props as SonataComponentProperties
      )

      return (
        <SonataAqueduct id={allocId} name={component.name}>
          {component(props)}
        </SonataAqueduct>
      )
      /// #endif
    },
  }[component.name]
}
