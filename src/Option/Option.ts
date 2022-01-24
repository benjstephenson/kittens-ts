import { OptionF } from '.'
import { flatMap, map } from './functions'

export type Option<A> = Some<A> | None<A>
export const OptionURI = 'Option'
export type OptionURI = typeof OptionURI

export class Some<A> implements OptionF {
  readonly tag = 'Some'
  readonly A!: A
  type!: Option<this['A']>

  constructor(private readonly value: A) {}
  R?: unknown
  E?: unknown

  isSome(): this is Some<A> {
    return true
  }

  isNone(): this is None<A> {
    return false
  }

  get(): A {
    return this.value
  }

  map<B>(f: (a: A) => B): Option<B> {
    return map(f, this)
  }

  flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return flatMap(f, this)
  }

  getOrElse(_default: A): A {
    return this.value
  }

  getOrCall(f: () => A): A {
    return this.value
  }
}

export class None<A> implements OptionF {
  readonly tag = 'None'
  readonly A!: A
  type!: Option<this['A']>

  isSome(): this is Some<A> {
    return false
  }
  isNone(): this is None<A> {
    return true
  }

  map<B>(f: (a: A) => B): Option<B> {
    return map(f, this)
  }

  flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return flatMap(f, this)
  }

  getOrElse(fallback: A): A {
    return fallback
  }

  getOrCall(f: () => A): A {
    return f()
  }
}
