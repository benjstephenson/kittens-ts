import * as Eq from '../Equal'
import { flatMap, map } from './functions'
import { getEquals } from './instances'

export type Option<A> = Some<A> | None<A>
export const OptionURI = 'Option'
export type OptionURI = typeof OptionURI

interface OptionFns<A> {
  isSome(): this is Some<A>

  isNone(): this is None<A>

  equals(other: Option<A>, eq: Eq.Equal<A>): boolean

  map<B>(f: (a: A) => B): Option<B>

  flatMap<B>(f: (a: A) => Option<B>): Option<B>

  getOrElse(_default: A): A

  getOrCall(f: () => A): A
}

export class Some<A> implements OptionFns<A> {
  readonly tag = 'Some'

  constructor(private readonly value: A) {}
  R?: unknown
  E?: unknown

  equals(other: Option<A>, eq = Eq.withDefault<A>()): boolean {
    return getEquals(eq).equals(this, other)
  }

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

  getOrCall(_f: () => A): A {
    return this.value
  }
}

export class None<A> implements OptionFns<A> {
  readonly tag = 'None'

  isSome(): this is Some<A> {
    return false
  }

  isNone(): this is None<A> {
    return true
  }

  equals(other: Option<A>, eq = Eq.withDefault<A>()): boolean {
    return getEquals(eq).equals(this, other)
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
