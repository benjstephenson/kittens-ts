import * as O from '../Option'
import { getEquals } from './instances'
import * as Eq from '../Equal'
import * as fns from './functions'

export type Either<E, A> = Left<E, A> | Right<E, A>

interface EitherFns<E, A> {
  isLeft(): this is Left<E, A>

  isRight(): this is Right<E, A>

  getOrElse(other: A): A

  getOrThrow(error: Error): A

  equals(other: Either<E, A>, eqE: Eq.Equal<E>, eqA: Eq.Equal<A>): boolean

  ap<B>(fab: Either<E, (r: A) => B>): Either<E, B>

  map<B>(f: (a: A) => B): Either<E, B>

  mapLeft<M>(f: (l: E) => M): Either<M, A>

  flatMap<E2, B>(f: (r: A) => Either<E2, B>): Either<E | E2, B>

  bimap<EE, AA>(fo: { Left: (e: E) => EE; Right: (a: A) => AA }): Either<EE, AA>

  fold<B>(f: (acc: B, a: A) => B, init: B): B

  toOption(): O.Option<A>
}

export class Left<E, A> implements EitherFns<E, A> {
  readonly tag = 'Left'

  constructor(private readonly value: E) {}

  isLeft(): this is Left<E, A> {
    return true
  }

  isRight(): this is Right<E, A> {
    return false
  }

  equals(other: Either<E, A>, eqE = Eq.withDefault<E>(), eqA = Eq.withDefault<A>()): boolean {
    return getEquals(eqE, eqA).equals(this, other)
  }

  get(): E {
    return this.value
  }

  getOrElse(other: A): A {
    return other
  }

  getOrThrow(error: Error): A {
    throw error
  }

  ap<B>(fab: Either<E, (r: A) => B>): Either<E, B> {
    return fns.ap(this, fab)
  }

  map<B>(f: (a: A) => B): Either<E, B> {
    return fns.map(f, this)
  }

  mapLeft<M>(f: (l: E) => M): Either<M, A> {
    return fns.mapLeft(f, this)
  }

  flatMap<E2, B>(f: (r: A) => Either<E2, B>): Either<E | E2, B> {
    return fns.flatMap(f, this)
  }

  bimap<EE, AA>(fo: { Left: (e: E) => EE; Right: (a: A) => AA }): Either<EE, AA> {
    return fns.bimap(fo, this)
  }

  fold<B>(f: (acc: B, a: A) => B, init: B): B {
    return fns.fold(f, init, this)
  }

  toOption(): O.Option<A> {
    return O.none()
  }
}

export class Right<E, A> implements EitherFns<E, A> {
  readonly tag = 'Right'

  constructor(private readonly value: A) {}

  isLeft(): this is Left<E, A> {
    return false
  }

  isRight(): this is Right<E, A> {
    return true
  }

  get(): A {
    return this.value
  }

  equals(other: Either<E, A>, eqE = Eq.withDefault<E>(), eqA = Eq.withDefault<A>()): boolean {
    return getEquals(eqE, eqA).equals(this, other)
  }

  getOrElse(_other: A): A {
    return this.value
  }

  getOrThrow(error: Error): A {
    return this.value
  }

  ap<E2, B>(fab: Either<E2, (r: A) => B>): Either<E | E2, B> {
    return fns.ap<E, E2, A, B>(this, fab)
  }

  map<B>(f: (a: A) => B) {
    return fns.map<E, A, B>(f, this)
  }

  mapLeft<E2>(_f: (l: E) => E2): Either<E2, A> {
    return <any>this
  }

  flatMap<E2, B>(f: (r: A) => Either<E2, B>): Either<E | E2, B> {
    return fns.flatMap<E, E2, A, B>(f, this)
  }

  bimap<E2, B>(fo: { Left: (e: E) => E2; Right: (a: A) => B }): Either<E2, B> {
    return fns.bimap(fo, this)
  }

  fold<B>(f: (acc: B, a: A) => B, init: B): B {
    return fns.fold(f, init, this)
  }

  toOption(): O.Option<A> {
    return O.some(this.value)
  }
}
