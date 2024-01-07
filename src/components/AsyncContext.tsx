/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 06/01/2024
 */

/**
 * This serves as an implementation of React context for async SSR.
 * Much better than the shitty useUniqueContext impl, even though it
 * is still a hack and involves double work during most uses.
 */

import { AsyncLocalStorage } from "node:async_hooks"

interface ReactAsyncContext<T> {
  readonly ctx: AsyncLocalStorage<T>
  readonly enter: (value: T, fn: () => Promise<void>) => Promise<void>
}

export function createAsyncContext<T>(): ReactAsyncContext<T> {
  const ctx = new AsyncLocalStorage<T>()

  return {
    ctx,
    enter: async (value: T, fn: () => Promise<void>) =>
      await ctx.run(value, fn),
  }
}

export function useAsyncContext<T>(
  context: ReactAsyncContext<T>
): T | undefined {
  return context.ctx.getStore()
}
