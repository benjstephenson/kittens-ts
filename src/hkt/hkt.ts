import { Either } from '../Either'
import { Option } from '../Option'

export interface HKT<F, A> {
  readonly _URI: F
  readonly _A: A
}

export interface HKT2<F, E, A> {
  readonly _URI: F
  readonly _E: E
  readonly _A: A
}

export interface HKT3<F, R, E, A> {
  readonly _URI: F
  readonly _R: R
  readonly _E: E
  readonly _A: A
}

export interface HKT4<F, S, R, E, A> {
  readonly _URI: F
  readonly _S: S
  readonly _R: R
  readonly _E: E
  readonly _A: A
}

export type UHKT<F> = [URI<'HKT', CustomType<'F', F>>]
export type UHKT2<F> = [URI<'HKT2', CustomType<'F', F>>]
export type UHKT3<F> = [URI<'HKT3', CustomType<'F', F>>]
export type UHKT4<F> = [URI<'HKT4', CustomType<'F', F>>]

// @ts-ignore
export interface URItoHKT<F, C, S, R, E, A> {
  Option: Option<A>
  Either: Either<E, A>
  HKT: HKT<GetCustomType<F, 'F'>, A>
  HKT2: HKT2<GetCustomType<F, 'F'>, E, A>
  HKT3: HKT3<GetCustomType<F, 'F'>, R, E, A>
  HKT4: HKT4<GetCustomType<F, 'F'>, S, R, E, A>
}

export type URI<F extends ConcreteURIS, C = {}> = {
  _F: F
  _C: C
}

export interface Base<F, C = {}> {
  _F: F
  _C: C
}

export type ConcreteURIS = keyof URItoHKT<any, any, any, any, any, any>
export type URIS = [URI<ConcreteURIS, any>, ...URI<ConcreteURIS, any>[]]

export interface CustomType<P extends string, V> {
  CustomType: {
    [p in P]: () => V
  }
}

export type GetCustomType<C, P extends string, D = any> = C extends CustomType<P, infer V> ? V : D

export type Type<F extends URIS, C, S, R, E, A> = TypeRec<F, C, S, R, E, A>

export type TypeRec<F, C, S, R, E, A> = F extends [any, ...infer Next]
  ? URItoHKT<
      F[0]['_C'],
      C,
      OrFix<'S', F[0]['_C'], OrFix<'S', C, S>>,
      OrFix<'R', F[0]['_C'], OrFix<'R', C, R>>,
      OrFix<'E', F[0]['_C'], OrFix<'E', C, E>>,
      TypeRec<Next, C, S, R, E, A>
    >[F[0]['_F']]
  : A

export type Tail<F extends [any, ...any[]]> = F extends [any, ...infer Tail] ? Tail : []

export type Param = 'S' | 'R' | 'E'

export interface Fix<P extends Param, K> {
  Fix: {
    [p in P]: K
  }
}

export type OrFix<P extends Param, C, V> = C extends Fix<P, infer K> ? K : V
