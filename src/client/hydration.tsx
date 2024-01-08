/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 07/01/2024
 */

/**
 * Client only, hydration facilities.
 */

/// #ifdef BROWSER
import { hydrate, FunctionComponent } from "preact"

import type {
  SonataConfig,
  SonataComponentProperties,
} from "@/components/ssr/SonataProperties.tsx"

// Components that need hydration.
import Footer from "@/components/Footer.tsx"
import Section from "@/components/Section.tsx"

// Components to be hydrated.
const toBeHydrated = {
  Footer,
  Section,
} as Record<string, FunctionComponent<any>>

/**
 * This is an empty web component used to selectively hydrate
 * portions of the webpage. Efficient? Not really, but (p)react
 * is stupid and doesn't allow per-element hydration.
 */
class AshleySonataAqueductWebC extends HTMLElement {
  constructor() {
    super()
  }
}
customElements.define("ashley-sonata-aqueduct", AshleySonataAqueductWebC)

/**
 * Ditto, but for storing props passed down from the server.
 */
class AshleySonataConfigWebC extends HTMLElement {
  constructor() {
    super()
  }
}
customElements.define("ashley-sonata-config", AshleySonataConfigWebC)

/**
 * Invoked once per page load.
 * TODO: Cache properties.
 */
export default function sonataHydrateComponents() {
  // Retrieve sonata properties from the web component.
  const sonataPropsElement = document.querySelector("ashley-sonata-config")
  if (sonataPropsElement == null) {
    throw new Error("Ashley Sonata configuration is missing!")
  }

  // sonata-config is guaranteed to have a JSON object.
  const sonataProps = JSON.parse(
    sonataPropsElement.textContent!
  ) as SonataConfig

  // Alright, let's hydrate the aqueducts.
  for (const [name, Component] of Object.entries(toBeHydrated)) {
    const componentPropList = sonataProps[name]

    // Find all the roots with the name.
    const roots = document.querySelectorAll(
      `ashley-sonata-aqueduct[name=${name}]`
    )

    for (const root of roots) {
      // Locate parameters.
      let params: SonataComponentProperties | undefined
      if (componentPropList !== undefined) {
        const rootId = parseInt(root.getAttribute("id")!)
        if (isNaN(rootId)) {
          console.warn(
            `Invalid Sonata id "${root.getAttribute(
              "id"
            )}" for component "${name}"`
          )
        } else {
          const paramIdx = componentPropList.findIndex((v) => v.id === rootId)
          if (paramIdx > -1) {
            params = componentPropList[paramIdx].props
            componentPropList.splice(paramIdx, 1)
          }
        }
      }

      if (params === undefined) {
        console.warn(
          `Sonata component "${name}" did not have props. It may break!`
        )
      }

      hydrate(<Component {...(params ?? {})} />, root)
    }
  }
}
/// #endif
