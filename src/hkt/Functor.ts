import { HKT, Kind, Typeclass } from './hkt'

export interface Semigroup<A> {
  readonly concat: (a: A, b: A) => A
}

export interface SemigroupF<F extends HKT> extends Typeclass<F> {
  readonly concat: <R, E, A>(
    semigroupA: Semigroup<A>
  ) => (fa: Kind<F, R, E, A>, fb: Kind<F, R, E, A>) => Kind<F, R, E, A>
}

export interface Monoid<F extends HKT> extends Typeclass<F>, SemigroupF<F> {
  readonly empty: <R, E, A>() => Kind<F, R, E, A>
}

export interface Functor<F extends HKT> extends Typeclass<F> {
  readonly map: <R, E, A, B>(f: (a: A) => B, fa: Kind<F, R, E, A>) => Kind<F, R, E, B>
}

export interface Apply<F extends HKT> extends Typeclass<F> {
  readonly ap: <R, R2, E, E2, A, B>(
    fa: Kind<F, R, E, A>,
    fab: Kind<F, R2, E2, (a: A) => B>
  ) => Kind<F, R & R2, E | E2, B>
}

export interface Applicative<F extends HKT> extends Typeclass<F>, Apply<F> {
  readonly of: <A>(a: A) => Kind<F, unknown, never, A>
}

export interface Monad<F extends HKT> extends Typeclass<F>, Applicative<F> {
  readonly flatMap: <R, R2, E, E2, A, B>(
    f: (a: A) => Kind<F, R2, E2, B>,
    fa: Kind<F, R, E, A>
  ) => Kind<F, R & R2, E | E2, B>
}
