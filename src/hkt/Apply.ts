import { Type, URIS } from './hkt'
import { Functor } from './Functor'

export interface Apply<F extends URIS, C = {}> extends Functor<F, C> {
  readonly _Apply: 'Apply'
  readonly ap: <S, R, E, A, B>(
    fab: Type<F, C, S, R, E, (a: A) => B>,
    fa: Type<F, C, S, R, E, A>
  ) => Type<F, C, S, R, E, B>
}
