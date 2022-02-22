export type NonEmptyArray<T> = Array<T> & {
  readonly 0: T
}

export const isNonEmptyArray = <T>(list: Array<T>): list is NonEmptyArray<T> => list.length > 0

export const head: <T>(l: NonEmptyArray<T>) => T = (l) => l[0]
export const tail: <T>(l: NonEmptyArray<T>) => T[] = (l) => l.slice(1)

export const concat = <A>(x: NonEmptyArray<A>, y: NonEmptyArray<A>): NonEmptyArray<A> =>
  [...x, ...y] as NonEmptyArray<A>
