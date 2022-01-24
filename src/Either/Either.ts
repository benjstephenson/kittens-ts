import * as O from '../Option'

export type Either<E, A> = Left<E> | Right<A>
export const EitherURI = 'Either'
export type EitherURI = typeof EitherURI

export class Left<E> {
  readonly tag = 'Left'

  constructor(private readonly value: E) {}

  isLeft(): this is Left<E> {
    return true
  }

  isRight(): this is Right<unknown> {
    return false
  }

  get(): E {
    return this.value
  }

  toOption<A>(): O.Option<A> {
    return O.none()
  }
}

export class Right<A> {
  readonly _F!: EitherURI
  readonly _A!: A
  readonly tag = 'Right'

  constructor(private readonly value: A) {}

  isLeft<E>(): this is Left<E> {
    return false
  }

  isRight(): this is Right<A> {
    return true
  }

  get(): A {
    return this.value
  }

  mapLeft<E, M>(_f: (l: E) => M): Either<M, A> {
    return <any>this
  }

  toOption(): O.Option<A> {
    return O.some(this.value)
  }
}
