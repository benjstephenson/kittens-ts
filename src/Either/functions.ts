import { widenFA } from '../hkt'
import { Either, Left, Right } from './Either'

export const left: <E, A>(l: E) => Either<E, A> = (l) => new Left(l)

export const right: <E, A>(r: A) => Either<E, A> = (r) => new Right(r)

export const isLeft = <E, A>(e: Either<E, A>): e is Left<E, A> => e.tag === 'Left'
export const isRight = <E, A>(e: Either<E, A>): e is Right<E, A> => e.tag === 'Right'

export const leftWiden: <E, E2, A>(e: Left<E, A>) => Left<E | E2, A> = (e) => e
export const rightWiden: <E, A, A2>(e: Left<E, A>) => Left<E, A2> = (e) => e as any

export const widenE = <E, E2, A>(self: Either<E, A>): Either<E2, A> => self as any
export const widenA = <E, A, A2>(self: Either<E, A>): Either<E, A2> => self as any

export const ap: <E, E2, A, B>(fa: Either<E, A>, fab: Either<E2, (a: A) => B>) => Either<E | E2, B> = (fa, fab) =>
  flatMap((ab) => map((a) => ab(a), fa), fab)

export const _ap: <E, A>(fa: Either<E, A>) => <E2, B>(fab: Either<E2, (a: A) => B>) => Either<E | E2, B> =
  (fa) => (fab) =>
    ap(fa, fab)

export const map: <E, A, B>(f: (a: A) => B, fa: Either<E, A>) => Either<E, B> = (f, fa) =>
  fa.isRight() ? right(f(fa.get())) : left(fa.get())

export const map_: <E, A, B>(f: (a: A) => B) => (fa: Either<E, A>) => Either<E, B> = (f) => (fa) => map(f, fa)

export const flatMap = <E, E2, A, B>(f: (a: A) => Either<E2, B>, fa: Either<E, A>): Either<E | E2, B> =>
  fa.isLeft() ? widenA(fa) : f(fa.get())

export const bimap: <E, E2, A, B>(fo: { Left: (e: E) => E2; Right: (a: A) => B }, fa: Either<E, A>) => Either<E2, B> = (
  fo,
  fa
) => (fa.isLeft() ? left(fo.Left(fa.get())) : right(fo.Right(fa.get())))

export const fold: <E, E2, A, B>(fo: { Left: (e: E) => E2; Right: (a: A) => B }, fa: Either<E, A>) => E2 | B = (
  fo,
  fa
) => (fa.isLeft() ? fo.Left(fa.get()) : fo.Right(fa.get()))

export const of: <E, A>(a: A) => Either<E, A> = (a) => right(a)

export const lift: <E, A, B>(f: (a: A) => B) => (fa: Either<E, A>) => Either<E, B> = (f) => map_(f)
