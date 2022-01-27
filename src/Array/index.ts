import * as Ord from '../Orderable'
import * as O from '../Option'
import { Applicative, HKT } from '../hkt'

export interface ArrayF extends HKT {
  readonly type: Array<this['A']>
}

export const applicative: Applicative<ArrayF> = {
  of: (a) => [a],
  ap: (fa, fab) => fab.flatMap((ab) => fa.map(ab)),
  map: (f, fa) => fa.map(f),
}

export const sort = <A>(a: A[], ord: Ord.Orderable<A>) => (a.length < 1 ? [] : a.slice().sort(ord.compare))

export const head = <T>(l: T[]): O.Option<T> => (l.length > 1 ? O.of(l[0]) : O.none())
