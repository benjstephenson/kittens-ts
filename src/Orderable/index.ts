import * as Eq from '../Equal'
import { Semigroup } from '../Semigroup'
import { Contravariant, HKT } from '../hkt'
import { Monoid } from '../Monoid'

export type Ordering = -1 | 0 | 1

export interface OrderableF extends HKT {
  readonly type: Orderable<this['A']>
}

export interface Orderable<A> extends Eq.Equal<A> {
  compare: (x: A, y: A) => Ordering
}

export const from = <A>(compare: (x: A, y: A) => Ordering): Orderable<A> => ({
  equals: (x, y) => compare(x, y) === 0,
  compare,
})

const primitive = <A>(x: A, y: A): Ordering => (x < y ? -1 : y > x ? 1 : 0)

export const number: Orderable<number> = from(primitive)
export const string: Orderable<string> = from(primitive)
export const boolean: Orderable<boolean> = from(primitive)

export const contramap = <A, B>(f: (b: B) => A, ord: Orderable<A>): Orderable<B> =>
  from((x: B, y: B) => ord.compare(f(x), f(y)))

export const contravariant: Contravariant<OrderableF> = {
  contramap,
}

export const getSemigroup = <A>(): Semigroup<Orderable<A>> => ({
  concat: (x, y) =>
    from((a, b) => {
      const cmpFirst = x.compare(a, b)
      if (cmpFirst !== 0) return cmpFirst
      else return y.compare(a, b)
    }),
})

export const getMonoid = <A>(): Monoid<Orderable<A>> => ({
  ...getSemigroup(),
  empty: from(() => 0),
})
