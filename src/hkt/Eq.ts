export const equals = <A>(a: A, b: A) => a === b

export interface Eq<A> {
  readonly _Eq: 'Eq'
  readonly equals: (a: A, b: A) => boolean
}
