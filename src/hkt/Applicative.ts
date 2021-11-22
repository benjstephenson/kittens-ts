import { Type, URIS } from './hkt'
import { Apply } from './Apply'

export interface Applicative<F extends URIS, C = {}> extends Apply<F, C> {
  readonly _Applicative: 'Applicative'
  readonly of: <S, R, E, A>(a: A) => Type<F, C, S, R, E, A>
}
