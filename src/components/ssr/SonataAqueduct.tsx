/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 07/01/2024
 */

import { ComponentChildren, JSX } from "preact"

import isBrowser from "./IsBrowser.ts"

export default function SonataAqueduct({
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
    return (
      // @ts-ignore
      <ashley-sonata-aqueduct name={name}>{children}</ashley-sonata-aqueduct>
    )
  }
}
