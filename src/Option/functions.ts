import { None, Option, Some } from './Option'
import { isNonEmptyArray } from '../NonEmptyArray'
import * as A from '../Array'
import { tuple } from '../functions'
import { Applicative, HKT, Kind, Traversable } from '../hkt'

export const none = <A>(): Option<A> => new None()

export const some = <A>(a: A): Option<A> => new Some(a)

const isSome = <A>(opt: Option<A>): opt is Some<A> => opt.tag === 'Some'

const isNone = <A>(opt: Option<A>): opt is None<A> => !isSome(opt)

export const of: <A>(a: A | undefined) => Option<A> = (a) => (a === undefined ? none() : some(a))

export const map: <A, B>(f: (a: A) => B, fa: Option<A>) => Option<B> = (f, fa) =>
  fa.isSome() ? some(f(fa.get())) : none()

export const map_: <A, B>(f: (a: A) => B) => (fa: Option<A>) => Option<B> = (f) => (fa) => map(f, fa)

export const ap: <A, B>(fa: Option<A>, fab: Option<(a: A) => B>) => Option<B> = (fa, fab) =>
  flatMap((f) => map(f, fa), fab)

export const flatMap: <A, B>(f: (a: A) => Option<B>, fa: Option<A>) => Option<B> = (f, fa) =>
  isSome(fa) ? f(fa.get()) : none()

export const flatMap_: <A, B>(f: (a: A) => Option<B>) => (fa: Option<A>) => Option<B> = (f) => (fa) => flatMap(f, fa)

export const lift: <A, B>(f: (a: A) => B) => (fa: Option<A>) => Option<B> = (f) => map_(f)

export const traverse =
  <F extends HKT>(F: Applicative<F>) =>
  <R, E, A, B>(f: (a: A) => Kind<F, R, E, B>, fa: Option<A>): Kind<F, R, E, Option<B>> =>
    fa.isNone()
      ? F.of(none())
      : F.ap(
          f(fa.get()),
          F.of((b) => some(b))
        )

export const sequence =
  <F extends HKT>(F: Applicative<F>) =>
  <R, E, A>(fa: Option<Kind<F, R, E, A>>): Kind<F, R, E, Option<A>> =>
    traverse(F)((x) => x, fa)

// specialised to Array
// export function sequence<T extends Array<Option<any>>, U>(...t: T & { readonly 0: Option<any> }): Option<Array<U>>
// export function sequence<U>(...list: Array<Option<U>>) {
//   if (!isNonEmptyArray(list)) return none()

//   const head = list[0]
//   const tail = list.splice(1)

//   return tail.reduce((acc, v) => acc.flatMap((h) => v.map((b) => [...h, b])), head.map(Array.of))
// }

export function sequenceT<T extends Array<Option<any>>>(
  ...t: T & { readonly 0: Option<any> }
): Option<{ [K in keyof T]: [T[K]] extends [Option<infer U>] ? U : never }>
export function sequenceT<U>(...list: Array<Option<U>>) {
  // TODO figure out how to unapply this list so we can reuse sequence.
  if (!isNonEmptyArray(list)) return none()

  const head = list[0]
  const tail = list.splice(1)

  return tail.reduce<any>((acc, v) => acc.flatMap((h: any) => v.map((b) => tuple(...h, b))), head.map(tuple))
}
