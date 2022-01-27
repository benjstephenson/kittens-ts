import * as Ord from '../Orderable'
import * as O from '../Option'

export const sort = <A>(a: A[], ord: Ord.Orderable<A>) => (a.length < 1 ? [] : a.slice().sort(ord.compare))

export const head = <T>(l: T[]): O.Option<T> => (l.length > 1 ? O.of(l[0]) : O.none())
