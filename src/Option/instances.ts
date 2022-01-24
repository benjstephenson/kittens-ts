import type { Option } from './Option'
import * as fns from './functions'
import { Apply, Functor, HKT, Monad, Applicative, SemigroupF, Monoid, Semigroup } from '../hkt'

export interface OptionF extends HKT {
  readonly type: Option<this['A']>
}

export const semigroup: SemigroupF<OptionF> = {
  concat: (semigroupA) => (fa, fb) => fns.flatMap((a) => fns.map((b) => semigroupA.concat(a, b), fb), fa),
}

export const monoid: Monoid<OptionF> = {
  ...semigroup,
  empty: fns.none,
}

export const functor: Functor<OptionF> = {
  map: fns.map,
}

export const apply: Apply<OptionF> = {
  ap: fns.ap,
}

export const applicative: Applicative<OptionF> = {
  ...apply,
  of: fns.of,
}

export const monad: Monad<OptionF> = {
  ...applicative,
  flatMap: fns.flatMap,
}
