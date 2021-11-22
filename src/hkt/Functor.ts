import { Base, Type, URIS } from './hkt'

export interface Functor<F extends URIS, C = {}> extends Base<F, C> {
  readonly _Functor: 'Functor'
  readonly map: <S, R, E, A, B>(f: (a: A) => B, fa: Type<F, C, S, R, E, A>) => Type<F, C, S, R, E, B>
}
