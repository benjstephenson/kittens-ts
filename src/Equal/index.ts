export interface Equal<A> {
  equals: (x: A, y: A) => boolean
}

export const contramap = <A, B>(f: (b: B) => A, eqA: Equal<A>): Equal<B> => makeEqual((x, y) => eqA.equals(f(x), f(y)))

export const makeEqual = <A>(equals: (x: A, y: A) => boolean): Equal<A> => ({
  equals,
})

export const withDefault = <A>() => makeEqual((x: A, y: A) => x === y)

export function record<R extends Record<string, any>>(equalities: {
  [K in keyof R]: Equal<R[K]>
}): Equal<R> {
  return makeEqual((x, y) => {
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
