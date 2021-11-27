import { Eq, equals, getInstance, Monoid, Semigroup } from './hkt'

export const eq: Eq<string> = getInstance({ equals })

export const semigroup: Semigroup<string> = getInstance({
  concat: (a, b) => a + b,
})

export const monoid: Monoid<string> = getInstance({
  ...semigroup,
  empty: () => '',
})
