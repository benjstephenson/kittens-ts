import type { Option } from './Option'
import * as fns from './functions'
import { Apply, Functor, HKT, Monad, Applicative, ComposeF, identityM, Foldable, Traversable, Alt } from '../hkt'
import { Equal } from '../Equal'
import * as Sg from '../Semigroup'
import { Monoid } from '../Monoid'

export interface OptionF extends HKT {
  readonly type: Option<this['A']>
}

export const getSemigroup = <A>(S: Sg.Semigroup<A>): Sg.Semigroup<Option<A>> => ({
  concat: (x, y) => (x.isNone() ? y : y.isNone() ? x : fns.some(S.concat(x.get(), y.get())))
})

export const getMonoid = <A>(sg: Sg.Semigroup<A>): Monoid<Option<A>> => ({
  ...getSemigroup(sg),
  empty: fns.none()
})

export const getEquals = <A>(eq: Equal<A>): Equal<Option<A>> => ({
  equals: (a, b) => a.isSome() && b.isSome() && eq.equals(a.get(), b.get())
})

export const functor: Functor<OptionF> = {
  map: fns.map
}

export const apply: Apply<OptionF> = {
  ...functor,
  ap: fns.ap
}

export const applicative: Applicative<OptionF> = {
  ...apply,
  of: fns.of
}

export const alt: Alt<OptionF> = {
  alt: fns.alt
}

export const foldable: Foldable<OptionF> = {
  fold: (f, init, fa) => (fa.isNone() ? init : f(init, fa.get()))
}

export const traversable: Traversable<OptionF> = {
  traverse: fns.traverse,
  sequence: fns.sequence
}

export const monad: Monad<OptionF> = optionT(identityM)
// export const monad: Monad<OptionF> = {
//   ...applicative,
//   flatMap: fns.flatMap,
// }

export function optionT<F extends HKT>(F: Monad<F>): Monad<ComposeF<F, OptionF>> {
  return {
    ap: (fa, fab) => F.flatMap(a => F.map(ab => fns.ap(a, ab), fab), fa),
    of: a => F.of(fns.some(a)),
    map: (f, fa) => F.map(a => fns.map(f, a), fa),
    flatMap: (f, fa) => F.flatMap(o => (o.isNone() ? F.of(fns.none()) : f(o.get())), fa)
  }
}
