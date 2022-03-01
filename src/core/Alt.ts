import { HKT, Kind, Typeclass } from './HKT'

export interface Alt<F extends HKT> extends Typeclass<F> {
  readonly alt: <R, E, A>(alt: Kind<F, R, E, A>, fa: Kind<F, R, E, A>) => Kind<F, R, E, A>
}
