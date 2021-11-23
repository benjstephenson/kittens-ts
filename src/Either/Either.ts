import { Option } from '../Option'
import { id } from '../functions'

export type Either<L, R> = Left<L, R> | Right<L, R>
export const EitherURI = 'Either'
export type EitherURI = typeof EitherURI

export const Either = {
  left: <L, R>(l: L): Either<L, R> => new Left(l),

  right: <L, R>(r: R): Either<L, R> => new Right(r),

  rightCast: <L, R, RR>(e: Left<L, R>): Left<L, RR> => e as any as Left<L, RR>,
}

class Left<L, R> {
  readonly _URI!: EitherURI
  readonly _A!: R
  readonly tag = 'Left'

  constructor(private readonly value: L) {}

  isLeft(): this is Left<L, R> {
    return true
  }

  isRight(): this is Right<L, R> {
    return false
  }

  rightCast<L, R, RR>(e: Left<L, R>): Left<L, RR> {
    return e as any as Left<L, RR>
  }

  ap<B>(fab: Either<L, (r: R) => B>): Either<L, B> {
    return fab.flatMap((ab) => this.map((r) => ab(r)))
  }

  map<U>(f: (r: R) => U): Either<L, U> {
    return this.bimap(id, f)
  }

  mapLeft<M>(f: (l: L) => M): Either<M, R> {
    return new Left(f(this.value))
  }

  flatMap<U>(_f: (r: R) => Either<L, U>): Either<L, U> {
    return <any>this
  }

  bimap<M, U>(lfn: (l: L) => M, _rfn: (r: R) => U): Either<M, U> {
    return new Left<M, U>(lfn(this.value))
  }

  toOption(): Option<R> {
    return Option.none()
  }
}

class Right<L, R> {
  readonly _URI!: EitherURI
  readonly _A!: R
  readonly tag = 'Right'

  constructor(private readonly value: R) {}

  isLeft(): this is Left<L, R> {
    return false
  }
  isRight(): this is Right<L, R> {
    return true
  }

  right(): R {
    return this.value
  }

  ap<B>(fab: Either<L, (r: R) => B>): Either<L, B> {
    return fab.flatMap((ab) => this.map((r) => ab(r)))
  }

  map<U>(f: (r: R) => U): Either<L, U> {
    return this.bimap(id, f)
  }

  mapLeft<M>(_f: (l: L) => M): Either<M, R> {
    return <any>this
  }

  flatMap<U>(f: (r: R) => Either<L, U>): Either<L, U> {
    return f(this.value)
  }

  bimap<M, U>(_lfn: (l: L) => M, rfn: (r: R) => U): Either<M, U> {
    return new Right<M, U>(rfn(this.value))
  }

  toOption(): Option<R> {
    return Option.some(this.value)
  }
}
