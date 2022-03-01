import type { Either } from './Either'
import * as fns from './functions'
import { Alt as _Alt } from '../core/Alt'
import { Applicative as _Applicative } from '../core/Applicative'
import { Equal } from '../core/Equal'
import { Semigroup } from '../core/Semigroup'
import { Apply as _Apply } from '../core/Apply'
import { Functor as _Functor } from '../core/Functor'
import { Failable as _Failable } from '../core/Failable'
import { Monad as _Monad } from '../core/Monad'
import { Foldable as _Foldable } from '../core/Foldable'
import { Traversable as _Traversable } from '../core/Traversable'
import { HKT, Kind } from '../core/HKT'
import { Eitherable } from '.'
import { EitherT } from '../EitherT'

export interface EitherF extends HKT {
  readonly type: Either<this['E'], this['A']>
}

export const getSemigroup = <E, A>(S: Semigroup<A>): Semigroup<Either<E, A>> => ({
  concat: (x, y) => (y.isLeft() ? x : x.isLeft() ? y : fns.right(S.concat(x.get(), y.get())))
})

export const Functor: _Functor<EitherF> = {
  map: fns._map
}

export const Apply: _Apply<EitherF> = {
  ...Functor,
  ap: fns._ap
}

export const Applicative: _Applicative<EitherF> = {
  ...Apply,
  of: fns.of
}

export const Monad: _Monad<EitherF> = {
  ...Applicative,
  flatMap: fns._flatMap
}

export const Foldable: _Foldable<EitherF> = {
  fold: fns._fold
}

export const Traversable: _Traversable<EitherF> = {
  traverse: fns._traverse,
  sequence: fns.sequence
}

export const Failable: _Failable<EitherF> = {
  fail: fns.left
}

export const eitherable: Eitherable<EitherF> = {
  toEither: fns.right
}

export const getEquals = <E, A>(eqE: Equal<E>, eqA: Equal<A>): Equal<Either<E, A>> => ({
  equals: (x, y) => (x.isLeft() && y.isLeft() ? eqE.equals(x.get(), y.get()) : x.isRight() && y.isRight() ? eqA.equals(x.get(), y.get()) : false)
})

export function eitherT<F extends HKT>(F: _Monad<F>): _Monad<EitherT<F>> {
  return {
    ap: (fa, fab) => F.flatMap(a => F.map(ab => fns._ap(a, ab), fab), fa),
    of: a => F.of(fns.right(a)),
    map: (ff, faa) => F.map(aa => fns._map(ff, aa), faa),

    flatMap: <R, R2, E, E2, A, B>(f: (a: A) => Kind<F, R2, never, Either<E2, B>>, faa: Kind<F, R, never, Either<E, A>>): Kind<F, R & R2, never, Either<E | E2, B>> =>
      F.flatMap(aa => (aa.isLeft() ? F.of(fns.leftWiden(fns.left(aa.get()))) : f(aa.get())), faa)
  }
}
