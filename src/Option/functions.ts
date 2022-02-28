import { None, Option, Some } from './Option'
import { isNonEmptyArray } from '../NonEmptyArray'
import { Applicative } from '@benjstephenson/kittens-ts-core/dist/src/Applicative'
import { HKT, Kind } from '@benjstephenson/kittens-ts-core/dist/src/HKT'
import { pipe, tuple } from '@benjstephenson/kittens-ts-core/dist/src/functions'

export const none = <A>(): Option<A> => new None()

export const some = <A>(a: A): Option<A> => new Some(a)

const isSome = <A>(opt: Option<A>): opt is Some<A> => opt.tag === 'Some'

const isNone = <A>(opt: Option<A>): opt is None<A> => !isSome(opt)

export const of: <A>(a: A | undefined) => Option<A> = a => (a === undefined ? none() : some(a))

export const map =
  <A, B>(f: (a: A) => B) =>
  (fa: Option<A>): Option<B> =>
    fa.isSome() ? some(f(fa.get())) : none()

export const _map = <A, B>(f: (a: A) => B, fa: Option<A>): Option<B> => map(f)(fa)

export const ap =
  <A, B>(fa: Option<A>) =>
  (fab: Option<(a: A) => B>): Option<B> =>
    pipe(
      fab,
      flatMap(f => pipe(fa, map(f)))
    )

export const _ap = <A, B>(fa: Option<A>, fab: Option<(a: A) => B>): Option<B> => pipe(fab, ap(fa))

export const flatMap =
  <A, B>(f: (a: A) => Option<B>) =>
  (fa: Option<A>): Option<B> =>
    isSome(fa) ? f(fa.get()) : none()

export const _flatMap = <A, B>(f: (a: A) => Option<B>, fa: Option<A>): Option<B> => pipe(fa, flatMap(f))

export const lift =
  <A, B>(f: (a: A) => B) =>
  (fa: Option<A>): Option<B> =>
    pipe(fa, map(f))

export const alt =
  <A>(a: Option<A>) =>
  (fa: Option<A>): Option<A> =>
    isSome(fa) ? fa : a

export const _alt = <A>(a: Option<A>, fa: Option<A>): Option<A> => pipe(fa, alt(a))

export const traverse =
  <F extends HKT>(F: Applicative<F>) =>
  <R, E, A, B>(f: (a: A) => Kind<F, R, E, B>) =>
  (fa: Option<A>): Kind<F, R, E, Option<B>> =>
    fa.isNone()
      ? F.of(none())
      : F.ap(
          f(fa.get()),
          F.of(b => some(b))
        )

export const _traverse =
  <F extends HKT>(F: Applicative<F>) =>
  <R, E, A, B>(f: (a: A) => Kind<F, R, E, B>, fa: Option<A>): Kind<F, R, E, Option<B>> =>
    pipe(fa, traverse(F)(f))

export const sequence =
  <F extends HKT>(F: Applicative<F>) =>
  <R, E, A>(fa: Option<Kind<F, R, E, A>>): Kind<F, R, E, Option<A>> =>
    pipe(
      fa,
      traverse(F)(x => x)
    )

// specialised to Array
// export function sequence<T extends Array<Option<any>>, U>(...t: T & { readonly 0: Option<any> }): Option<Array<U>>
// export function sequence<U>(...list: Array<Option<U>>) {
//   if (!isNonEmptyArray(list)) return none()

//   const head = list[0]
//   const tail = list.splice(1)

//   return tail.reduce((acc, v) => acc.flatMap((h) => v.map((b) => [...h, b])), head.map(Array.of))
// }

export function sequenceT<T extends Array<Option<any>>>(...t: T & { readonly 0: Option<any> }): Option<{ [K in keyof T]: [T[K]] extends [Option<infer U>] ? U : never }>
export function sequenceT<U>(...list: Array<Option<U>>) {
  // TODO figure out how to unapply this list so we can reuse sequence.
  if (!isNonEmptyArray(list)) return none()

  const head = list[0]
  const tail = list.splice(1)

  return tail.reduce<any>((acc, v) => acc.flatMap((h: any) => v.map(b => tuple(...h, b))), head.map(tuple))
}
