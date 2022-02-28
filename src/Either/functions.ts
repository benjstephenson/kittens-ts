import { pipe } from '@benjstephenson/kittens-ts-core/dist/src/functions'
import { Applicative } from '@benjstephenson/kittens-ts-core/dist/src/Applicative'
import { HKT, Kind } from '@benjstephenson/kittens-ts-core/dist/src/HKT'
import { Either, Left, Right } from './Either'

export const left: <E, A>(l: E) => Either<E, A> = l => new Left(l)

export const right: <E, A>(r: A) => Either<E, A> = r => new Right(r)

export const isLeft = <E, A>(e: Either<E, A>): e is Left<E, A> => e.tag === 'Left'
export const isRight = <E, A>(e: Either<E, A>): e is Right<E, A> => e.tag === 'Right'

export const leftWiden = <E, E2, A>(self: Either<E, A>): Either<E | E2, A> => self
export const rightWiden = <E, A, B>(self: Either<E, A>): Either<E, A | B> => self

export const _ap = <E, E2, A, B>(fa: Either<E, A>, fab: Either<E2, (a: A) => B>): Either<E | E2, B> => ap(fa)(fab)

export const ap =
  <E, A>(fa: Either<E, A>) =>
  <E2, B>(fab: Either<E2, (a: A) => B>): Either<E | E2, B> =>
    _flatMap(ab => _map(a => ab(a), fa), fab)

export const _mapLeft = <E, E2, A>(f: (a: E) => E2, fa: Either<E, A>): Either<E2, A> => mapLeft(f)(fa)

export const mapLeft =
  <E, E2>(f: (a: E) => E2) =>
  <A>(fa: Either<E, A>): Either<E2, A> =>
    fa.isLeft() ? left(f(fa.get())) : right(fa.get())

export const map =
  <A, B>(f: (a: A) => B) =>
  <E>(fa: Either<E, A>): Either<E, B> =>
    fa.isRight() ? right(f(fa.get())) : left(fa.get())

export const _map = <E, A, B>(f: (a: A) => B, fa: Either<E, A>): Either<E, B> => map(f)(fa)

export const flatMap =
  <E2, A, B>(f: (a: A) => Either<E2, B>) =>
  <E>(fa: Either<E, A>): Either<E | E2, B> =>
    fa.isLeft() ? left(fa.get()) : f(fa.get())

export const _flatMap = <E, E2, A, B>(f: (a: A) => Either<E2, B>, fa: Either<E, A>): Either<E | E2, B> => flatMap(f)(fa)

export const _bimap = <E, E2, A, B>(fo: { Left: (e: E) => E2; Right: (a: A) => B }, fa: Either<E, A>): Either<E2, B> => bimap(fo)(fa)

export const bimap =
  <E, E2, A, B>(fo: { Left: (e: E) => E2; Right: (a: A) => B }) =>
  (fa: Either<E, A>): Either<E2, B> =>
    fa.isLeft() ? left(fo.Left(fa.get())) : right(fo.Right(fa.get()))

export const fold =
  <A, B>(f: (acc: B, a: A) => B, init: B) =>
  <E>(fa: Either<E, A>): B =>
    fa.isLeft() ? init : f(init, fa.get())

export const _fold = <E, A, B>(f: (acc: B, a: A) => B, init: B, fa: Either<E, A>): B => fold(f, init)(fa)

export const match =
  <E, A, B>(fo: { Left: (e: E) => B; Right: (a: A) => B }) =>
  (fa: Either<E, A>): B =>
    fa.isLeft() ? fo.Left(fa.get()) : fo.Right(fa.get())

export const _match = <E, A, B>(fo: { Left: (e: E) => B; Right: (a: A) => B }, fa: Either<E, A>): B => match(fo)(fa)

export const of: <E, A>(a: A) => Either<E, A> = a => right(a)

export const traverse =
  <F extends HKT>(F: Applicative<F>) =>
  <R, E, A, B>(f: (a: A) => Kind<F, R, E, B>) =>
  (fa: Either<E, A>): Kind<F, R, E, Either<E, B>> =>
    fa.isLeft()
      ? F.of(left(fa.get()))
      : F.ap(
          f(fa.get()),
          F.of(x => right(x))
        )

export const _traverse =
  <F extends HKT>(F: Applicative<F>) =>
  <R, E, A, B>(f: (a: A) => Kind<F, R, E, B>, fa: Either<E, A>): Kind<F, R, E, Either<E, B>> =>
    traverse(F)(f)(fa)

export const sequence =
  <F extends HKT>(F: Applicative<F>) =>
  <R, E, A>(fa: Either<E, Kind<F, R, E, A>>): Kind<F, R, E, Either<E, A>> =>
    pipe(
      fa,
      traverse(F)(x => x)
    )
