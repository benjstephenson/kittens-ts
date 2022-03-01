import { Applicative } from './Applicative'
import { HKT, Kind } from './HKT'

export interface Monad<F extends HKT> extends Applicative<F> {
  readonly flatMap: <R, R2, E, E2, A, B>(f: (a: A) => Kind<F, R2, E2, B>, fa: Kind<F, R, E, A>) => Kind<F, R & R2, E | E2, B>
}
