import type { Either } from './Either'
import * as fns from './functions'
import { Apply, Functor, HKT, Monad, Applicative, ComposeF, EitherT, Kind, Foldable } from '../hkt'
import * as Eq from '../Equal'
import { Semigroup } from '../Semigroup'

export interface EitherF extends HKT {
  readonly type: Either<this['E'], this['A']>
}

export const getSemigroup = <E, A>(S: Semigroup<A>): Semigroup<Either<E, A>> => ({
  concat: (x, y) => (y.isLeft() ? x : x.isLeft() ? y : fns.right(S.concat(x.get(), y.get()))),
})

export const functor: Functor<EitherF> = {
  map: fns.map,
}

export const apply: Apply<EitherF> = {
  ...functor,
  ap: fns.ap,
}

export const applicative: Applicative<EitherF> = {
  ...apply,
  of: fns.of,
}

export const monad: Monad<EitherF> = {
  ...applicative,
  flatMap: fns.flatMap,
}

export const fold = <E, A, B>(f: (acc: B, a: A) => B, init: B, fa: Either<E, A>): B =>
  fa.isLeft() ? init : f(init, fa.get())

export const foldable: Foldable<EitherF> = {
  fold,
}

export const getEquals = <E, A>(eqE: Eq.Equal<E>, eqA: Eq.Equal<A>): Eq.Equal<Either<E, A>> => ({
  equals: (x, y) =>
    x.isLeft() && y.isLeft()
      ? eqE.equals(x.get(), y.get())
      : x.isRight() && y.isRight()
      ? eqA.equals(x.get(), y.get())
      : false,
})

export function eitherT<F extends HKT>(F: Monad<F>): Monad<EitherT<F>> {
  return {
    ap: (fa, fab) => F.flatMap((a) => F.map((ab) => fns.ap(a, ab), fab), fa),
    of: (a) => F.of(fns.right(a)),
    map: (ff, faa) => F.map((aa) => fns.map(ff, aa), faa),

    flatMap: <R, R2, E, E2, A, B>(
      f: (a: A) => Kind<F, R2, never, Either<E2, B>>,
      faa: Kind<F, R, never, Either<E, A>>
    ): Kind<F, R & R2, never, Either<E | E2, B>> =>
      F.flatMap(
        (aa) =>
          fns.fold(
            {
              Left: (l) => F.of(fns.left<E | E2, B>(l)),
              Right: (r) => f(r),
            },
            aa
          ),
        faa
      ),
  }
}
