import { Apply, HKT, Kind } from '../hkt'

export interface Semigroup<A> {
  readonly concat: (a: A, b: A) => A
}

export const reverse = <A>(S: Semigroup<A>): Semigroup<A> => ({
  concat: (x, y) => S.concat(y, x),
})

export const left = <A>(): Semigroup<A> => ({
  concat: (a, _) => a,
})

export const right = <A>(): Semigroup<A> => ({
  concat: (_, b) => b,
})

export const sum: Semigroup<number> = {
  concat: (a, b) => a + b,
}

export const product: Semigroup<number> = {
  concat: (a, b) => a * b,
}

export const string: Semigroup<string> = {
  concat: (a, b) => `${a} ${b}`,
}

export const both: Semigroup<number> = {
  concat: (a, b) => a && b,
}

export const either: Semigroup<number> = {
  concat: (a, b) => a || b,
}

export const array = <A>(): Semigroup<A[]> => ({
  concat: (a, b) => [...a, ...b],
})

export const getApplySemigroup =
  <F extends HKT, R, E>(F: Apply<F>) =>
  <A>(S: Semigroup<A>): Semigroup<Kind<F, R, E, A>> => ({
    concat: (fa, fb) =>
      F.ap(
        fa,
        F.map((a) => (b) => S.concat(a, b), fb)
      ),
  })

export function record<R extends Record<string, any>>(semigroups: {
  [K in keyof R]: Semigroup<R[K]>
}): Semigroup<R> {
  return {
    concat: (x, y) =>
      Object.keys(semigroups).reduce((acc, key) => {
        acc[key] = semigroups[key].concat(x[key], y[key])
        return acc
      }, {} as any),
  }
}
