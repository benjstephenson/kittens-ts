export function id<A>(a: A): A {
  return a
}

export function tuple<T extends Array<any>>(...t: T) {
  return t
}

export function pipe<A>(a: A): A
export function pipe<A, B>(a: A, ab: (a: A) => B): B
export function pipe<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C
export function pipe<A, B, C, D>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): D
export function pipe<A, B, C, D, E>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: E) => E): D
export function pipe<A, B, C, D, E, F>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: E) => E, ef: (e: E) => F): D
export function pipe(a: unknown, ab?: Function, bc?: Function, cd?: Function): unknown {
  switch (arguments.length) {
    case 1:
      return a
    case 2:
      return ab!(a)
    case 3:
      return bc!(ab!(a))
    case 4:
      return cd!(bc!(ab!(a)))
    default:
      const [head, ...rest] = arguments
      return rest.reduce((result, fn) => fn(result), head)

    // let ret = arguments[0]
    // for (let i = 1; i < arguments.length; i++) {
    //   ret = arguments[i](ret)
    // }
    // return ret
  }
}
