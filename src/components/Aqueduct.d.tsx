import { DOMAttributes } from "react"
import Aqueduct from "./Aqueduct.tsx"

type CustomElement<T> = Partial<
  T & DOMAttributes<T> & { name: string; children: any }
>

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["ashley-aqueduct"]: CustomElement<typeof Aqueduct>
    }
  }
}
