import { HKT, Kind, Typeclass } from './HKT'

export interface Failable<F extends HKT> extends Typeclass<F> {
  readonly fail: <E>(e: E) => Kind<F, unknown, E, never>
}
