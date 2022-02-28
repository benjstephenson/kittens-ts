import * as O from '../Option'
import { getEquals } from './instances'
import * as fns from './functions'
import { pipe } from '@benjstephenson/kittens-ts-core/dist/src/functions'
import * as Eq from '@benjstephenson/kittens-ts-core/dist/src/Equal'

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
    return pipe(fab, fns.ap(this))
  }

  map<B>(f: (a: A) => B): Either<E, B> {
    return pipe(this, fns.map(f))
  }

  mapLeft<M>(f: (l: E) => M): Either<M, A> {
    return pipe(this, fns.mapLeft(f))
  }

  flatMap<E2, B>(f: (r: A) => Either<E2, B>): Either<E | E2, B> {
    return pipe(this, fns.flatMap(f))
  }

  bimap<EE, AA>(fo: { Left: (e: E) => EE; Right: (a: A) => AA }): Either<EE, AA> {
    return pipe(this, fns.bimap(fo))
  }

  fold<B>(f: (acc: B, a: A) => B, init: B): B {
    return pipe(this, fns.fold(f, init))
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

  getOrThrow(_: Error): A {
    return this.value
  }

  ap<E2, B>(fab: Either<E2, (r: A) => B>): Either<E | E2, B> {
    return fns._ap<E, E2, A, B>(this, fab)
  }

  map<B>(f: (a: A) => B): Either<E, B> {
    return fns._map<E, A, B>(f, this)
  }

  mapLeft<E2>(_f: (l: E) => E2): Either<E2, A> {
    return <any>this
  }

  flatMap<E2, B>(f: (r: A) => Either<E2, B>): Either<E | E2, B> {
    return fns._flatMap<E, E2, A, B>(f, this)
  }

  bimap<E2, B>(fo: { Left: (e: E) => E2; Right: (a: A) => B }): Either<E2, B> {
    return fns._bimap(fo, this)
  }

  fold<B>(f: (acc: B, a: A) => B, init: B): B {
    return fns._fold(f, init, this)
  }

  toOption(): O.Option<A> {
    return O.some(this.value)
  }
}
