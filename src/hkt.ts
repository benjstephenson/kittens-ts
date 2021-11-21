

export interface HKT<F, A> {
  readonly _URI: F
  readonly _A: A
}

export interface URItoHKT<A> { }

export type URIS = keyof URItoHKT<any>

export type Type<URI extends URIS, A> = URItoHKT<A>[URI]

export interface Functor<F extends URIS> {
  map: <A, B>(f: (a: A) => B, fa: Type<F, A>) => Type<F, B>
}

export interface Apply<F extends URIS> extends Functor<F> {
  ap: <A, B>(fab: Type<F, (a: A) => B>, fa: Type<F, A>) => Type<F, B>
}

export interface Applicative<F extends URIS> extends Apply<F> {
  of: <A>(a: A) => Type<F, A>
}

export interface Monad<F extends URIS> extends Applicative<F> {
  pure: <A>(a: A) => Type<F, A>
  flatMap: <A, B>(f: (a: A) => Type<F, B>, fa: Type<F, A>) => Type<F, B>
}
