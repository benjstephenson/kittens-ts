export type Option<A> = Some<A> | None<A>
export const OptionURI = 'Option'
export type OptionURI = typeof OptionURI

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

export class Some<A> {
  readonly _F!: OptionURI
  readonly _A!: A
  readonly tag = 'Some'

  constructor(private readonly value: A) {}

  isSome(): this is Some<A> {
    return true
  }
  isNone(): this is None<A> {
    return false
  }

  get(): A {
    return this.value
  }

  map<B>(f: (a: A) => B): Option<B> {
    return map(f, this)
  }

  flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return flatMap(f, this)
  }

  getOrElse(_default: A): A {
    return this.value
  }
}

export class None<A> {
  readonly _F!: OptionURI
  readonly _A!: A
  readonly tag = 'None'

  isSome(): this is Some<A> {
    return false
  }
  isNone(): this is None<A> {
    return true
  }

  map<B>(f: (a: A) => B): Option<B> {
    return map(f, this)
  }

  flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return flatMap(f, this)
  }

  getOrElse(fallback: A): A {
    return fallback
  }
}
