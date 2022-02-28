import type { Either } from './Either'
import * as fns from './functions'
import { Equal } from '@benjstephenson/kittens-ts-core/dist/src/Equal'
import { Functor } from '@benjstephenson/kittens-ts-core/dist/src/Functor'
import { Foldable } from '@benjstephenson/kittens-ts-core/dist/src/Foldable'
import { Apply } from '@benjstephenson/kittens-ts-core/dist/src/Apply'
import { Applicative } from '@benjstephenson/kittens-ts-core/dist/src/Applicative'
import { Monad } from '@benjstephenson/kittens-ts-core/dist/src/Monad'
import { Failable } from '@benjstephenson/kittens-ts-core/dist/src/Failable'
import { Traversable } from '@benjstephenson/kittens-ts-core/dist/src/Traversable'
import { HKT, Kind } from '@benjstephenson/kittens-ts-core/dist/src/HKT'
import { Semigroup } from '@benjstephenson/kittens-ts-core/dist/src/Semigroup'
import { Eitherable } from '.'
import { EitherT } from '../EitherT'

export interface EitherF extends HKT {
  readonly type: Either<this['E'], this['A']>
}

export const getSemigroup = <E, A>(S: Semigroup<A>): Semigroup<Either<E, A>> => ({
  concat: (x, y) => (y.isLeft() ? x : x.isLeft() ? y : fns.right(S.concat(x.get(), y.get())))
})

export const functor: Functor<EitherF> = {
  map: fns._map
}

export const apply: Apply<EitherF> = {
  ...functor,
  ap: fns._ap
}

export const applicative: Applicative<EitherF> = {
  ...apply,
  of: fns.of
}

export const monad: Monad<EitherF> = {
  ...applicative,
  flatMap: fns._flatMap
}

export const foldable: Foldable<EitherF> = {
  fold: fns._fold
}

export const traversable: Traversable<EitherF> = {
  traverse: fns._traverse,
  sequence: fns.sequence
}

export const failable: Failable<EitherF> = {
  fail: fns.left
}

export const eitherable: Eitherable<EitherF> = {
  toEither: fns.right
}

export const getEquals = <E, A>(eqE: Equal<E>, eqA: Equal<A>): Equal<Either<E, A>> => ({
  equals: (x, y) => (x.isLeft() && y.isLeft() ? eqE.equals(x.get(), y.get()) : x.isRight() && y.isRight() ? eqA.equals(x.get(), y.get()) : false)
})

export function eitherT<F extends HKT>(F: Monad<F>): Monad<EitherT<F>> {
  return {
    ap: (fa, fab) => F.flatMap(a => F.map(ab => fns._ap(a, ab), fab), fa),
    of: a => F.of(fns.right(a)),
    map: (ff, faa) => F.map(aa => fns._map(ff, aa), faa),

    flatMap: <R, R2, E, E2, A, B>(f: (a: A) => Kind<F, R2, never, Either<E2, B>>, faa: Kind<F, R, never, Either<E, A>>): Kind<F, R & R2, never, Either<E | E2, B>> =>
      F.flatMap(aa => (aa.isLeft() ? F.of(fns.leftWiden(fns.left(aa.get()))) : f(aa.get())), faa)
  }
}
