import { Type, URIS } from './hkt'
import { Applicative } from './Applicative'

export interface Monad<F extends URIS, C = {}> extends Applicative<F, C> {
  readonly _Monad: 'Monad'
  readonly pure: <S, R, E, A>(a: A) => Type<F, C, S, R, E, A>
  readonly flatMap: <S, R, E, A, B>(
    f: (a: A) => Type<F, C, S, R, E, B>,
    fa: Type<F, C, S, R, E, A>
  ) => Type<F, C, S, R, E, B>
}
