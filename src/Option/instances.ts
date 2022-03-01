import type { Option } from './Option'
import * as fns from './functions'
import { Alt as _Alt } from '@benjstephenson/kittens-ts-core/dist/src/Alt'
import { Applicative } from '@benjstephenson/kittens-ts-core/dist/src/Applicative'
import { Equal } from '@benjstephenson/kittens-ts-core/dist/src/Equal'
import { Semigroup } from '@benjstephenson/kittens-ts-core/dist/src/Semigroup'
import { ComposeF } from '@benjstephenson/kittens-ts-core/dist/src/Compose'
import { Apply } from '@benjstephenson/kittens-ts-core/dist/src/Apply'
import { Functor } from '@benjstephenson/kittens-ts-core/dist/src/Functor'
import { Monad } from '@benjstephenson/kittens-ts-core/dist/src/Monad'
import { Monoid } from '@benjstephenson/kittens-ts-core/dist/src/Monoid'
import { Foldable } from '@benjstephenson/kittens-ts-core/dist/src/Foldable'
import { Traversable } from '@benjstephenson/kittens-ts-core/dist/src/Traversable'
import { HKT } from '@benjstephenson/kittens-ts-core/dist/src/HKT'
import { identityM } from '@benjstephenson/kittens-ts-core/dist/src/Id'
import { pipe } from '@benjstephenson/kittens-ts-core/dist/src/functions'

export interface OptionF extends HKT {
  readonly type: Option<this['A']>
}

export const getSemigroup = <A>(S: Semigroup<A>): Semigroup<Option<A>> => ({
  concat: (x, y) => (x.isNone() ? y : y.isNone() ? x : fns.some(S.concat(x.get(), y.get())))
})

export const getMonoid = <A>(sg: Semigroup<A>): Monoid<Option<A>> => ({
  ...getSemigroup(sg),
  empty: fns.none()
})

export const getEquals = <A>(eq: Equal<A>): Equal<Option<A>> => ({
  equals: (a, b) => a.isSome() && b.isSome() && eq.equals(a.get(), b.get())
})

export const functor: Functor<OptionF> = {
  map: fns._map
}

export const apply: Apply<OptionF> = {
  ...functor,
  ap: fns._ap
}

export const applicative: Applicative<OptionF> = {
  ...apply,
  of: fns.of
}

export const alt: _Alt<OptionF> = {
  alt: fns._alt
}

export const foldable: Foldable<OptionF> = {
  fold: (f, init, fa) => (fa.isNone() ? init : f(init, fa.get()))
}

export const traversable: Traversable<OptionF> = {
  traverse: fns._traverse,
  sequence: fns.sequence
}

export const monad: Monad<OptionF> = optionT(identityM)
// export const monad: Monad<OptionF> = {
//   ...applicative,
//   flatMap: fns.flatMap,
// }

export function optionT<F extends HKT>(F: Monad<F>): Monad<ComposeF<F, OptionF>> {
  return {
    ap: (fa, fab) => F.flatMap(a => F.map(ab => fns._ap(a, ab), fab), fa),
    of: a => F.of(fns.some(a)),
    map: (f, fa) => F.map(a => pipe(a, fns.map(f)), fa),
    flatMap: (f, fa) => F.flatMap(o => (o.isNone() ? F.of(fns.none()) : f(o.get())), fa)
  }
}
