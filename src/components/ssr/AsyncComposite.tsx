/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 07/01/2024
 */

/**
 * Wrapper over AsyncContext to composite multiple "contexts".
 * This is voodoo TypeScript shit.
 */

import { createAsyncContext, useAsyncContext } from "./AsyncContext.tsx"

interface AsyncContextSegment<T = any> {
  readonly $v: symbol
  readonly $t: T // Not really used.
}

export function createAsyncContextSegment<T>(desc?: string) {
  return { $v: Symbol(desc) } as AsyncContextSegment<T>
}

export function createAsyncContextComposite<T extends AsyncContextSegment[]>(
  ...segments: T
) {
  // Extract the type of $t from each segment in the tuple
  type ExtractTupleType<T> = {
    [K in keyof T]: T[K] extends AsyncContextSegment<infer U> ? U : never
  }

  // Define valueParameters as a tuple of extracted types
  type ValueParameters = ExtractTupleType<T>

  // Create context for this.
  const ctx = createAsyncContext()

  return {
    ctx: ctx.ctx,
    enter: (values: ValueParameters, fn: () => Promise<any>) => {
      // TODO: Do we have a better way of doing this? Seems finnicky to
      // expect the order of the array to remain the same cross-context.
      let i = 0
      const valuemap = {} as Record<symbol, any>
      for (const value of values) {
        valuemap[segments[i].$v] = value
        i++
      }
      return ctx.enter(valuemap, fn)
    },
  }
}

export function useAsyncContextComposite(
  composite: ReturnType<typeof createAsyncContextComposite>
) {
  const valuemap = useAsyncContext(composite) as Record<symbol, any>
  return (segment: AsyncContextSegment) => valuemap[segment.$v]
}
