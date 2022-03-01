import * as E from '../Either'
import * as fns from './functions'
import { getEquals } from './instances'
import { pipe } from '../core/functions'
import * as Eq from '../core/Equal'

export type Option<A> = Some<A> | None<A>

interface IOption<A> {
  isSome(): this is Some<A>

  isNone(): this is None<A>

  equals(other: Option<A>, eq: Eq.Equal<A>): boolean

  map<B>(f: (a: A) => B): Option<B>

  flatMap<B>(f: (a: A) => Option<B>): Option<B>

  getOrElse(_default: A): A

  getOrCall(f: () => A): A

  orElse(other: Option<A>): Option<A>

  toEither<E>(e: E): E.Either<E, A>
}

export class Some<A> implements IOption<A> {
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
    return pipe(this, fns.map(f))
  }

  flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return pipe(this, fns.flatMap(f))
  }

  getOrElse(_default: A): A {
    return this.value
  }

  getOrCall(_f: () => A): A {
    return this.value
  }

  orElse(other: Option<A>): Option<A> {
    return pipe(this, fns.alt(other))
  }

  toEither<E>(e: E): E.Either<E, A> {
    return E.right(this.value)
  }
}

export class None<A> implements IOption<A> {
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
    return pipe(this, fns.map(f))
  }

  flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return pipe(this, fns.flatMap(f))
  }

  getOrElse(fallback: A): A {
    return fallback
  }

  getOrCall(f: () => A): A {
    return f()
  }

  orElse(other: Option<A>): Option<A> {
    return pipe(this, fns.alt(other))
  }

  toEither<E>(e: E): E.Either<E, A> {
    return E.left(e)
  }
}
