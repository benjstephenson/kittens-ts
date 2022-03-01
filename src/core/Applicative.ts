import { Apply } from './Apply'
import { HKT, Kind } from './HKT'

export interface Applicative<F extends HKT> extends Apply<F> {
  readonly of: <R, E, A>(a: A) => Kind<F, R, E, A>
}
