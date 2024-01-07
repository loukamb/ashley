/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 06/01/2024
 */

import { ComponentChildren } from "preact"

import { createAsyncContext, useAsyncContext } from "./AsyncContext.tsx"

type ReportHelmetChildren = (children: ComponentChildren) => void

export const HelmetContext = createAsyncContext<
  ReportHelmetChildren | undefined
>()

/**
 * Add elements to the `<head>` tag. Please be smart and avoid inserting
 * duplicate elements in the head.
 */
export default function Helmet({ children }: { children: ComponentChildren }) {
  const helmetReporter = useAsyncContext(HelmetContext)
  if (helmetReporter !== undefined) {
    helmetReporter(children)
  }
  return <></>
}
