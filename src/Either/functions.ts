import { pipe, id } from '../functions'
import { Applicative, HKT, Kind } from '../hkt'
import { Either, Left, Right } from './Either'
import * as A from '../Array'

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

export const flatMap_ =
  <E, E2, A, B>(f: (a: A) => Either<E2, B>) =>
  (fa: Either<E, A>): Either<E | E2, B> =>
    flatMap(f, fa)

export const bimap: <E, E2, A, B>(fo: { Left: (e: E) => E2; Right: (a: A) => B }, fa: Either<E, A>) => Either<E2, B> = (
  fo,
  fa
) => (fa.isLeft() ? left(fo.Left(fa.get())) : right(fo.Right(fa.get())))

export const bimap_: <E, E2, A, B>(fo: {
  Left: (e: E) => E2
  Right: (a: A) => B
}) => (fa: Either<E, A>) => Either<E2, B> = (fo) => (fa) => bimap(fo, fa)

export const fold = <E, A, B>(f: (acc: B, a: A) => B, init: B, fa: Either<E, A>): B =>
  fa.isLeft() ? init : f(init, fa.get())

export const match: <E, E2, A, B>(fo: { Left: (e: E) => E2; Right: (a: A) => B }, fa: Either<E, A>) => E2 | B = (
  fo,
  fa
) => (fa.isLeft() ? fo.Left(fa.get()) : fo.Right(fa.get()))

export const match_: <E, E2, A, B>(fo: { Left: (e: E) => E2; Right: (a: A) => B }) => (fa: Either<E, A>) => E2 | B =
  (fo) => (fa) =>
    match(fo, fa)

export const of: <E, A>(a: A) => Either<E, A> = (a) => right(a)

export const lift: <E, A, B>(f: (a: A) => B) => (fa: Either<E, A>) => Either<E, B> = (f) => map_(f)

export const traverse =
  <F extends HKT>(F: Applicative<F>) =>
  <R, E, A, B>(f: (a: A) => Kind<F, R, E, B>, fa: Either<E, A>): Kind<F, R, E, Either<E, B>> =>
    fa.isLeft()
      ? F.of(left(fa.get()))
      : F.ap(
          f(fa.get()),
          F.of((x) => right(x))
        )

export const sequence =
  <F extends HKT>(F: Applicative<F>) =>
  <R, E, A>(fa: Either<E, Kind<F, R, E, A>>): Kind<F, R, E, Either<E, A>> =>
    traverse(F)((x) => x, fa)
