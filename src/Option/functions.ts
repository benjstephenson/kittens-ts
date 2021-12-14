import { None, Option, Some } from './Option'
import { isNonEmptyArray } from '../NonEmptyArray/functions'
import { tuple } from '../functions'

export const none = <A>(): Option<A> => new None()

export const some = <A>(a: A): Option<A> => new Some(a)

export const of: <A>(a: A) => Option<A> = (a) => (a === undefined ? none() : some(a))

export const map: <A, B>(f: (a: A) => B, fa: Option<A>) => Option<B> = (f, fa) =>
  fa.isSome() ? some(f(fa.get())) : none()
export const _map: <A>(fa: Option<A>) => <B>(f: (a: A) => B) => Option<B> = (fa) => (f) => map(f, fa)
export const map_: <A, B>(f: (a: A) => B) => (fa: Option<A>) => Option<B> = (f) => (fa) => map(f, fa)

export const ap: <A, B>(fab: Option<(a: A) => B>, fa: Option<A>) => Option<B> = (fab, fa) =>
  flatMap((f) => fa.map(f), fab)
export const _ap: <A>(fa: Option<A>) => <B>(fab: Option<(a: A) => B>) => Option<B> = (fa) => (fab) => ap(fab, fa)
export const ap_: <A, B>(fab: Option<(a: A) => B>, fa: Option<A>) => Option<B> = (fab, fa) => ap(fab, fa)

export const flatMap: <A, B>(f: (a: A) => Option<B>, fa: Option<A>) => Option<B> = (f, fa) =>
  fa.isSome() ? f(fa.get()) : none()
export const _flatMap: <A>(fa: Option<A>) => <B>(f: (a: A) => Option<B>) => Option<B> = (fa) => (f) => flatMap(f, fa)
export const flatMap_: <A, B>(f: (a: A) => Option<B>) => (fa: Option<A>) => Option<B> = (f) => (fa) => flatMap(f, fa)

export const lift: <A, B>(f: (a: A) => B) => (a: Option<A>) => Option<B> = (f) => (a) => a.map(f)

export function sequence<T extends Array<Option<any>>, U>(...t: T & { readonly 0: Option<any> }): Option<Array<U>>
export function sequence<U>(...list: Array<Option<U>>) {
  if (!isNonEmptyArray(list)) return none()

  const head = list[0]
  const tail = list.splice(1)

  return tail.reduce((acc, v) => acc.flatMap((h) => v.map((b) => [...h, b])), head.map(Array.of))
}

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
