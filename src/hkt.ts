
export interface HKT<F, A> {
  readonly _URI: F
  readonly _A: A
}

export interface HKT2<F, E, A> {
  readonly _URI: F
  readonly _E: E
  readonly _A: A
}

export interface URItoHKT<S, R, E, A> { }

export type URIS = keyof URItoHKT<any, any, any, any>

export type Type<URI extends URIS, C, S, R, E, A> = URItoHKT<
  OrFix<'S', C, S>,
  OrFix<'R', C, R>,
  OrFix<'E', C, E>,
  A
>[URI]

export type Param = 'S' | 'R' | 'E'

export interface Fix<P extends Param, K> {
  Fix: {
    [p in P]: K
  }
}

export type OrFix<P extends Param, C, V> = C extends Fix<P, infer K> ? K : V


export interface Functor<F extends URIS, C = {}> {
  readonly map: <S, R, E, A, B>(f: (a: A) => B, fa: Type<F, C, S, R, E, A>) => Type<F, C, S, R, E, B>
}

export interface BiFunctor<F extends URIS, C = {}> {
  readonly bimap: <S, R, E, E2, A, A2>(fe: (e: E) => E2, fa: (a: A) => A2, F: Type<F, C, S, R, E, A>) => Type<F, C, S, R, E2, A2>
}

export interface Apply<F extends URIS, C = {}> extends Functor<F, C> {
  readonly ap: <S, R, E, A, B>(fab: Type<F, C, S, R, E, (a: A) => B>, fa: Type<F, C, S, R, E, A>) => Type<F, C, S, R, E, B>
}

export interface Applicative<F extends URIS, C = {}> extends Apply<F, C> {
  readonly of: <S, R, E, A>(a: A) => Type<F, C, S, R, E, A>
}

export interface Monad<F extends URIS, C = {}> extends Applicative<F, C> {
  readonly pure: <S, R, E, A>(a: A) => Type<F, C, S, R, E, A>
  readonly flatMap: <S, R, E, A, B>(f: (a: A) => Type<F, C, S, R, E, B>, fa: Type<F, C, S, R, E, A>) => Type<F, C, S, R, E, B>
}

export interface Semigroup<A> {
  readonly concat: (a: A, b: A) => A
}

export interface Monoid<A> extends Semigroup<A> {
  readonly empty: () => A
}

// export type functorRegistry = { [f in URIS]: Functor<f> }

// export const functorRegistry: functorRegistry = {
//   Option: optionFunctor,
//   Either: eitherFunctor
// }

// export type monadRegistry = { [f in URIS]: Monad<f> }

// export const monadRegistry: monadRegistry = {
//   Option: optionMonad,
//   Either: eitherMonad
// }
