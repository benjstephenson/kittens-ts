export interface Monoid<A> {
  readonly empty: A
}

export const string: Monoid<string> = {
  empty: '',
}

export const number: Monoid<number> = {
  empty: 0,
}

export const date: Monoid<Date> = {
  empty: new Date(0),
}

export const array = <A>(): Monoid<A[]> => ({
  empty: [],
})
