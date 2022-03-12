import { HKT, Kind, Typeclass } from './HKT'

export interface Functor<F extends HKT> extends Typeclass<F> {
  readonly map: <R, E, A, B>(f: (a: A) => B, fa: Kind<F, R, E, A>) => Kind<F, R, E, B>
}

export interface Functor2<F extends HKT> extends Typeclass<F> {
  readonly map_: <A, B>(f: (a: A) => B) => <R, E>(fa: Kind<F, R, E, A>) => Kind<F, R, E, B>
}
