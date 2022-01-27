import { Contravariant, HKT } from '../hkt'

export interface Equal<A> {
  equals: (x: A, y: A) => boolean
}

export interface EqualF extends HKT {
  readonly type: Equal<this['A']>
}

export const contramap = <A, B>(f: (b: B) => A, eqA: Equal<A>): Equal<B> => from((x, y) => eqA.equals(f(x), f(y)))

export const contravariant: Contravariant<EqualF> = {
  contramap,
}

export const from = <A>(equals: (x: A, y: A) => boolean): Equal<A> => ({
  equals,
})

export const withDefault = <A>() => from((x: A, y: A) => x === y)

export function record<R extends Record<string, any>>(equalities: {
  [K in keyof R]: Equal<R[K]>
}): Equal<R> {
  return from((x, y) => {
    return Object.keys(equalities).every((key) => equalities[key].equals(x[key], y[key]))

    // for (const key in equalities) {
    //   if (!equalities[key].equals(x[key], y[key])) {
    //     return false
    //   }
    // }
    // return true
  })
}

export const string: Equal<string> = withDefault()
export const number: Equal<number> = withDefault()
export const boolean: Equal<boolean> = withDefault()
export const date: Equal<Date> = contramap((d) => d.valueOf(), number)
