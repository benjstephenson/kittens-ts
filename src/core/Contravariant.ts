import { HKT, Kind, Typeclass } from './HKT'

export interface Contravariant<F extends HKT> extends Typeclass<F> {
  readonly contramap: <R, E, A, B>(f: (b: B) => A, fa: Kind<F, R, E, A>) => Kind<F, R, E, B>
}
