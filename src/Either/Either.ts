import * as O from '../Option'
import { ap, bimap, flatMap, map, rightWiden } from './functions'

export type Either<E, A> = Left<E, A> | Right<E, A>

interface EitherFuns<E, A> {
  isLeft(): this is Left<E, A>

  isRight(): this is Right<E, A>

  // get(): E

  getOrElse(other: A): A

  //rightCast<RR>(): Left<E, RR>

  ap<B>(fab: Either<E, (r: A) => B>): Either<E, B>

  map<B>(f: (a: A) => B): Either<E, B>

  mapLeft<M>(f: (l: E) => M): Either<M, A>

  flatMap<E2, B>(f: (r: A) => Either<E2, B>): Either<E | E2, B>

  bimap<EE, AA>(fo: { Left: (e: E) => EE; Right: (a: A) => AA }): Either<EE, AA>

  toOption(): O.Option<A>
}

export class Left<E, A> implements EitherFuns<E, A> {
  readonly tag = 'Left'

  constructor(private readonly value: E) {}

  isLeft(): this is Left<E, A> {
    return true
  }

  isRight(): this is Right<E, A> {
    return false
  }

  get(): E {
    return this.value
  }

  getOrElse(other: A): A {
    return other
  }

  rightCast<RR>(): Left<E, RR> {
    return rightWiden(this)
  }

  ap<B>(fab: Either<E, (r: A) => B>): Either<E, B> {
    return ap(this, fab)
  }

  map<B>(f: (a: A) => B): Either<E, B> {
    return map(f, this)
  }

  mapLeft<M>(f: (l: E) => M): Either<M, A> {
    return new Left(f(this.value))
  }

  flatMap<E2, B>(f: (r: A) => Either<E2, B>): Either<E | E2, B> {
    return flatMap(f, this)
  }

  bimap<EE, AA>(fo: { Left: (e: E) => EE; Right: (a: A) => AA }): Either<EE, AA> {
    return bimap(fo, this)
  }

  toOption(): O.Option<A> {
    return O.none()
  }
}

export class Right<E, A> implements EitherFuns<E, A> {
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

  getOrElse(other: A): A {
    return this.value
  }

  ap<E2, B>(fab: Either<E2, (r: A) => B>): Either<E | E2, B> {
    return ap<E, E2, A, B>(this, fab)
  }

  map<B>(f: (a: A) => B) {
    return map<E, A, B>(f, this)
  }

  mapLeft<E2>(_f: (l: E) => E2): Either<E2, A> {
    return <any>this
  }

  flatMap<E2, B>(f: (r: A) => Either<E2, B>): Either<E | E2, B> {
    return flatMap<E, E2, A, B>(f, this)
  }

  bimap<E2, B>(fo: { Left: (e: E) => E2; Right: (a: A) => B }): Either<E2, B> {
    return bimap(fo, this)
  }

  toOption(): O.Option<A> {
    return O.some(this.value)
  }
}
