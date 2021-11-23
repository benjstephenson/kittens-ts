export function id<A>(a: A): A {
  return a
}

export function tuple<T extends Array<any>>(...t: T) {
  return t
}
