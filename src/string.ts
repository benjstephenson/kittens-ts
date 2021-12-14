import { Eq, equals, makeInstance, Monoid, Semigroup } from './hkt'

export const eq: Eq<string> = makeInstance({ equals })

export const semigroup: Semigroup<string> = makeInstance({
  concat: (a, b) => a + b,
})

export const monoid: Monoid<string> = makeInstance({
  ...semigroup,
  empty: () => '',
})
