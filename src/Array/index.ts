import * as Ord from '../Orderable'
import * as O from '../Option'
import * as Sg from '../Semigroup'
import { Applicative, Apply, HKT, Kind, Traversable } from '../hkt'
import { Monoid } from '../Monoid'
import { tuple } from '../functions'
import { curry } from '../curry'

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

export function sequenceT<F extends HKT>(
  F: Apply<F>
): <R, E, T extends Array<Kind<F, R, E, any>>>(
  ...t: T & { readonly 0: Kind<F, R, E, any> }
) => Kind<F, R, E, { [K in keyof T]: [T[K]] extends [Kind<F, R, E, infer A>] ? A : never }>
export function sequenceT<F extends HKT>(F: Apply<F>) {
  return <R, E, A>(...list: Array<Kind<F, R, E, A>>) => {
    const curriedTupleCtr = curry(tuple)

    const head = list[0]
    const tail = list.splice(1)

    return tail.reduce(
      (acc, val) =>
        F.ap(
          acc,
          F.map((v) => (a) => tuple(...a, v), val)
        ),
      F.map(curriedTupleCtr, head)
    )
  }
}

export const monoid = <A>(): Monoid<Array<A>> => ({
  empty: [],
  concat,
})

export const traversable: Traversable<ArrayF> = {
  traverse,
  sequence,
}
