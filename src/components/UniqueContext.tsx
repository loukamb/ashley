/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 06/01/2024
 */

/**
 * This hack exists because React still doesn't like asynchronous, much less
 * asynchronous operations in server-side rendering that absolutely needs
 * React Context-like behavior to pass down props without shitty prop drilling.
 * Seriously how are you meant to avoid prop drilling with async components?
 * I don't want to npm install react-async and add in 1500 other dependencies.
 */

import { AsyncLocalStorage } from "node:async_hooks"

const asyncContext = new AsyncLocalStorage()

export function useUniqueContext<T = any>(key: string) {
  const localStore = asyncContext.getStore() as Record<string, any>
  return localStore === undefined ? undefined : (localStore[key] as T)
}

export async function enterUniqueContext<
  Fn extends (...args: any[]) => Promise<any>
>(fn: Fn, values: Record<string, any>) {
  return asyncContext.run(values, fn)
}
