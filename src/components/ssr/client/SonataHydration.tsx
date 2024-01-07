/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 07/01/2024
 */

/**
 * Client only, hydration facilities.
 */

import { hydrate, FunctionComponent } from "preact"

import type { SonataComponentProperties } from "../SonataProperties.tsx"

// Components that need hydration.
import Footer from "@/components/Footer.tsx"

// Components to be hydrated.
const toBeHydrated = {
  Footer,
} as Record<string, FunctionComponent>

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
  const sonataProps = JSON.parse(sonataPropsElement.textContent!) as Record<
    string,
    SonataComponentProperties
  >

  // Alright, let's hydrate the aqueducts.
  for (const [name, Component] of Object.entries(toBeHydrated)) {
    ;(async () => {
      let params = sonataProps[name]
      if (params === undefined) {
        console.warn(
          `Sonata component "${name}" did not have props. It may break!`
        )
        params = {}
      }

      // Find all the roots with the name.
      const roots = document.querySelectorAll(
        `ashley-sonata-aqueduct[name=${name}]`
      )
      for (const root of roots) {
        hydrate(Component(params ?? {}), root)
      }
    })().catch(console.error)
  }
}
