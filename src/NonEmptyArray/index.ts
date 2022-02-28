import { Semigroup } from '@benjstephenson/kittens-ts-core/dist/src/Semigroup'

export type NonEmptyArray<T> = Array<T> & {
  readonly 0: T
}

export const isNonEmptyArray = <T>(list: Array<T>): list is NonEmptyArray<T> => list.length > 0

export const head: <T>(l: NonEmptyArray<T>) => T = l => l.slice(0, 1)[0]
export const tail: <T>(l: NonEmptyArray<T>) => T[] = l => l.slice(1)

export const semigroup = <A>(): Semigroup<NonEmptyArray<A>> => ({
  concat
})

export const concat = <A>(x: NonEmptyArray<A>, y: NonEmptyArray<A>): NonEmptyArray<A> => x.slice().concat(y.slice()) as NonEmptyArray<A>
//  [...x, ...y] as NonEmptyArray<A>
