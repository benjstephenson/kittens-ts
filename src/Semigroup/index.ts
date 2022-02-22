import { Apply, Contravariant, Foldable, HKT, Kind } from '../hkt'
import * as NEA from '../NonEmptyArray'

export interface Semigroup<A> {
  readonly concat: (a: A, b: A) => A
}

export interface SemigroupF extends HKT {
  readonly type: Semigroup<this['A']>
}

export const from = <A>(concat: (x: A, y: A) => A): Semigroup<A> => ({
  concat,
})

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

export const both: Semigroup<boolean> = {
  concat: (a, b) => a && b,
}

export const either: Semigroup<boolean> = {
  concat: (a, b) => a || b,
}

export const array = <A>(): Semigroup<A[]> => ({
  concat: (a, b) => [...a, ...b],
})

export const nel = <A>(): Semigroup<NEA.NonEmptyArray<A>> => ({
  concat: NEA.concat,
})

export const fold =
  <A>(S: Semigroup<A>, initial: A) =>
  (values: ReadonlyArray<A>): A =>
    values.reduce((acc, val) => S.concat(acc, val), initial)

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
