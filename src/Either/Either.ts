import * as O from '../Option'
import { map, flatMap, ap, bimap, rightCast } from './functions'

export type Either<E, A> = Left<E, A> | Right<E, A>
export const EitherURI = 'Either'
export type EitherURI = typeof EitherURI

export class Left<E, A> {
  readonly _F!: EitherURI
  readonly _E!: E
  readonly _A!: A
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

  rightCast<RR>(): Left<E, RR> {
    return rightCast(this)
  }

  ap<B>(fab: Either<E, (r: A) => B>): Either<E, B> {
    return ap(fab, this)
  }

  map<B>(f: (a: A) => B): Either<E, B> {
    return map(f, this)
  }

  mapLeft<M>(f: (l: E) => M): Either<M, A> {
    return new Left(f(this.value))
  }

  flatMap<U>(f: (r: A) => Either<E, U>): Either<E, U> {
    return flatMap(f, this)
  }

  bimap<EE, AA>(fo: { Left: (e: E) => EE; Right: (a: A) => AA }): Either<EE, AA> {
    return bimap(fo, this)
  }

  toOption(): O.Option<A> {
    return O.none()
  }
}

export class Right<E, A> {
  readonly _F!: EitherURI
  readonly _E!: E
  readonly _A!: A
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

  ap<B>(fab: Either<E, (r: A) => B>): Either<E, B> {
    return ap(fab, this)
  }

  map<B>(f: (a: A) => B): Either<E, B> {
    return map(f, this)
  }

  mapLeft<M>(_f: (l: E) => M): Either<M, A> {
    return <any>this
  }

  flatMap<B>(f: (r: A) => Either<E, B>): Either<E, B> {
    return flatMap(f, this)
  }

  bimap<EE, AA>(fo: { Left: (e: E) => EE; Right: (a: A) => AA }): Either<EE, AA> {
    return bimap(fo, this)
  }

  toOption(): O.Option<A> {
    return O.some(this.value)
  }
}
