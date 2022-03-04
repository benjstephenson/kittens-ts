import type { Option } from './Option'
import * as fns from './functions'
import { Alt as _Alt } from '../core/Alt'
import { Applicative as _Applicative } from '../core/Applicative'
import { Equal } from '../core/Equal'
import { Semigroup } from '../core/Semigroup'
import { ComposeF } from '../core/Compose'
import { Apply as _Apply } from '../core/Apply'
import { Functor as _Functor } from '../core/Functor'
import { Monad as _Monad } from '../core/Monad'
import { Monoid } from '../core/Monoid'
import { Foldable as _Foldable } from '../core/Foldable'
import { Traversable as _Traversable } from '../core/Traversable'
import { HKT } from '../core/HKT'
import { identityM } from '../core/Id'
import { pipe } from '../core/functions'

export interface OptionF extends HKT {
  readonly type: Option<this['A']>
}

export const getSemigroup = <A>(S: Semigroup<A>): Semigroup<Option<A>> => ({
  concat: (x, y) => (x.isNone() ? y : y.isNone() ? x : fns.some(S.concat(x.value, y.value)))
})

export const getMonoid = <A>(sg: Semigroup<A>): Monoid<Option<A>> => ({
  ...getSemigroup(sg),
  empty: fns.none()
})

export const getEquals = <A>(eq: Equal<A>): Equal<Option<A>> => ({
  equals: (a, b) => a.isSome() && b.isSome() && eq.equals(a.value, b.value)
})

export const Functor: _Functor<OptionF> = {
  map: fns._map
}

export const Apply: _Apply<OptionF> = {
  ...Functor,
  ap: fns._ap
}

export const Applicative: _Applicative<OptionF> = {
  ...Apply,
  of: fns.of
}

export const Alt: _Alt<OptionF> = {
  alt: fns._alt
}

export const Foldable: _Foldable<OptionF> = {
  fold: (f, init, fa) => (fa.isNone() ? init : f(init, fa.value))
}

export const Traversable: _Traversable<OptionF> = {
  traverse: fns._traverse,
  sequence: fns.sequence
}

export const Monad: _Monad<OptionF> = optionT(identityM)
// export const monad: Monad<OptionF> = {
//   ...applicative,
//   flatMap: fns.flatMap,
// }

export function optionT<F extends HKT>(F: _Monad<F>): _Monad<ComposeF<F, OptionF>> {
  return {
    ap: (fa, fab) => F.flatMap(a => F.map(ab => fns._ap(a, ab), fab), fa),
    of: a => F.of(fns.some(a)),
    map: (f, fa) => F.map(a => pipe(a, fns.map(f)), fa),
    flatMap: (f, fa) => F.flatMap(o => (o.isNone() ? F.of(fns.none()) : f(o.value)), fa)
  }
}
