import { HKT } from '../hkt'
import * as Sg from '../Semigroup'

export interface Monoid<A> extends Sg.Semigroup<A> {
  readonly empty: A
}

export interface MonoidF extends HKT {
  readonly type: Monoid<this['A']>
}

export const string: Monoid<string> = {
  ...Sg.string,
  empty: '',
}

export const number: Monoid<number> = {
  ...Sg.sum,
  empty: 0,
}

export const array = <A>(): Monoid<A[]> => ({
  ...Sg.array(),
  empty: [],
})

export const fold = <A>(M: Monoid<A>): ((values: ReadonlyArray<A>) => A) => Sg.fold(M, M.empty)
