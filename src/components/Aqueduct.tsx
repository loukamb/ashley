/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 06/01/2024
 */

import { ComponentChildren, FunctionComponent, JSX } from "preact"

import isBrowser from "./IsBrowser.ts"

// Imported components with acqueducts.
import Footer from "./Footer.tsx"

interface AqueductRegistration<T = any> {
  Component: FunctionComponent<T>
  getParams?: () => Promise<T>
}

/**
 * Recognized aqueducts classes. This is used by the client
 * to locate selectively hydratable elements on the page.
 */
export const Aqueducts = {
  footer: { Component: Footer },
} as Record<string, AqueductRegistration>

/**
 * Wrapping your component in this allows it to be hydrated selectively
 * by the client. Make sure to add your component class to the exported
 * variable `Aqueducts`.
 */
export default function Aqueduct({
  name,
  children,
}: {
  name: string
  children: ComponentChildren
}): JSX.Element {
  if (isBrowser()) {
    // @ts-ignore
    return children
  } else {
    // @ts-ignore
    return <ashley-aqueduct name={name}>{children}</ashley-aqueduct>
  }
}
