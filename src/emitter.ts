/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import EventEmitter from "node:events"

type SafeEmitterDictionary = {
  [name: string]: (...args: any[]) => void
}

export class SafeEventEmitter<
  T extends SafeEmitterDictionary = Record<string, (...args: any[]) => void>
> {
  private _base: EventEmitter

  on(event: keyof T, listener: T[typeof event]) {
    this._base.on(event as string, listener)
  }

  off(event: keyof T, listener: T[typeof event]) {
    this._base.off(event as string, listener)
  }

  once(event: keyof T, listener: T[typeof event]) {
    this._base.once(event as string, listener)
  }

  emit(event: keyof T, ...args: Parameters<T[typeof event]>) {
    this._base.emit(event as string, ...args)
  }

  /**
   * Queue the emit in node's event queue.
   */
  async discard_emit(event: keyof T, ...args: Parameters<T[typeof event]>) {
    this._base.emit(event as string, ...args)
  }

  clear() {
    this._base.removeAllListeners()
  }

  constructor() {
    this._base = new EventEmitter()
  }
}

export default SafeEventEmitter
