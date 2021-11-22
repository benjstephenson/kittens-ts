import { Base, Type, URIS } from './hkt'

export interface BiFunctor<F extends URIS, C = {}> extends Base<F, C> {
  readonly _Bifunctor: 'Bifunctor'
  readonly bimap: <S, R, E, E2, A, A2>(
    fe: (e: E) => E2,
    fa: (a: A) => A2
  ) => (F: Type<F, C, S, R, E, A>) => Type<F, C, S, R, E2, A2>
}
