/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 06/01/2024
 */

import { ComponentChildren } from "preact"

import { RenderContextComposite } from "./pages/Render.tsx"
import {
  createAsyncContextSegment,
  useAsyncContextComposite,
} from "./AsyncComposite.tsx"

type ReportHelmetChildren = (children: ComponentChildren) => void

export const HelmetContext = createAsyncContextSegment<
  ReportHelmetChildren | undefined
>("helmet-context")

/**
 * Add elements to the `<head>` tag. Please be smart and avoid inserting
 * duplicate elements in the head.
 */
export default function Helmet({ children }: { children: ComponentChildren }) {
  const useAsyncContext = useAsyncContextComposite(RenderContextComposite)
  const helmetReporter = useAsyncContext(HelmetContext) as ReportHelmetChildren
  if (helmetReporter !== undefined) {
    helmetReporter(children)
  }
  return <></>
}
