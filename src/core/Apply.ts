import { Functor } from './Functor'
import { HKT, Kind } from './HKT'
import { Monad } from './Monad'

export interface Apply<F extends HKT> extends Functor<F> {
  readonly ap: <R, R2, E, E2, A, B>(fa: Kind<F, R, E, A>, fab: Kind<F, R2, E2, (a: A) => B>) => Kind<F, R & R2, E | E2, B>
}

export const getApply = <F extends HKT>(F: Monad<F>): Apply<F> => ({
  map: F.map,
  ap: F.ap
})
