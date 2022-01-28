import * as Ord from '../Orderable'
import * as O from '../Option'
import { Applicative, HKT, Kind, Traversable } from '../hkt'
import { Monoid } from '../Monoid'

export interface ArrayF extends HKT {
  readonly type: Array<this['A']>
}

export const applicative: Applicative<ArrayF> = {
  of: (a) => [a],
  ap: (fa, fab) => fab.flatMap((ab) => fa.map(ab)),
  map: (f, fa) => fa.map(f),
}

export const empty = <A>(): A[] => []

export const concat = <A>(x: A[], y: A[]): A[] => [...x, ...y]

export const sort = <A>(a: A[], ord: Ord.Orderable<A>) => (a.length < 1 ? [] : a.slice().sort(ord.compare))

export const head = <T>(l: T[]): O.Option<T> => (l.length > 1 ? O.of(l[0]) : O.none())

export const fold = <A>(f: (acc: A, cur: A) => A, init: A, fa: A[]) => fa.reduce(f, init)

export const traverse =
  <G extends HKT>(G: Applicative<G>) =>
  <R, E, A, B>(f: (a: A) => Kind<G, R, E, B>, fa: A[]): Kind<G, R, E, B[]> => {
    if (fa.length < 1) return G.of(empty())

    return fa.reduce(
      (acc, val) =>
        G.ap(
          f(val),
          G.map((bs) => (b: B) => [...bs, b], acc)
        ),
      G.of<R, E, B[]>(empty())
    )
  }

export const sequence =
  <G extends HKT>(G: Applicative<G>) =>
  <R, E, A>(fa: Kind<G, R, E, A>[]): Kind<G, R, E, A[]> =>
    traverse(G)((x) => x, fa)

// export const sequence = <G extends HKT>(G: Applicative<G>) => <R, E, A>(fa: Kind<G, R, E, A>[]): Kind<G, R, E, A[]> => {
//   if (fa.length < 1)
//     return G.of(unit())

//   return fa.reduce(
//     (acc, val) => G.ap(
//       val,
//       G.map((as) => (a: A) => [...as, a], acc)
//     )
//     , G.of<R, E, A[]>(unit()))

// }

export const monoid = <A>(): Monoid<Array<A>> => ({
  empty: [],
  concat,
})

export const traversable: Traversable<ArrayF> = {
  traverse,
  sequence,
}
