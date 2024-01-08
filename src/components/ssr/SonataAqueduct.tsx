/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 07/01/2024
 */

// @ts-nocheck

import { ComponentChildren, JSX } from "preact"

import isBrowser from "../shared/IsBrowser.ts"

export default function SonataAqueduct({
  id,
  name,
  children,
}: {
  id: number
  name: string
  children: ComponentChildren
}): JSX.Element {
  if (isBrowser()) {
    return children
  } else {
    return (
      <ashley-sonata-aqueduct id={id} name={name}>
        {children}
      </ashley-sonata-aqueduct>
    )
  }
}
