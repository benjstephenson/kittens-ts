import { Semigroup } from './Semigroup'

export interface Monoid<A> extends Semigroup<A> {
  readonly _Monoid: 'Monoid'
  readonly empty: () => A
}
