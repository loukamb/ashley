/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 06/01/2024
 */
import React from "react"
import isBrowser from "./IsBrowser.ts"

// Imported components with acqueducts.
import Footer from "./Footer.tsx"

interface AqueductRegistration<T = any> {
  Component: (params: T) => JSX.Element
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
  children: React.ReactNode
}) {
  if (isBrowser()) {
    return children
  } else {
    return <ashley-aqueduct name={name}>{children}</ashley-aqueduct>
  }
}
