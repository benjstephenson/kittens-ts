import { HKT, Kind, Typeclass } from './HKT'

export interface Foldable<F extends HKT> extends Typeclass<F> {
  readonly fold: <R, E, A, B>(f: (acc: B, a: A) => B, init: B, fa: Kind<F, R, E, A>) => B
}
