export interface Semigroup<A> {
  readonly _Semigroup: 'Semigroup'
  readonly concat: (a: A, b: A) => A
}
