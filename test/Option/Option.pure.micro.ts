import { assertThat } from 'mismatched'
import * as O from '../../src/Option'
import * as fc from 'fast-check'

describe('Option pure laws', () => {
  const inc = (n: number) => n + 1

  it('identity', () => {
    fc.assert(
      fc.property(fc.integer(), value => {
        const some = O.some(value)

        assertThat(
          O.Applicative.ap(
            some,
            O.Applicative.of(x => x)
          )
        ).is(some)
      })
    )
  })

  it('homomorphic', () => {
    // we can lift the func and the argument and then combine them
    // or we can combine them and then lift the result
    fc.assert(
      fc.property(fc.integer(), value => {
        assertThat(O.Applicative.ap(O.Applicative.of(value), O.Applicative.of(inc))).is(O.Applicative.of(inc(value)))
      })
    )
  })

  it('interchange', () => {
    // we can lift value and and apply it to the function in fab
    // or we can lift f => f(value) and apply the function in fab to that
    // i.e ap just applies the rhs to lhs; no special handling of either
    fc.assert(
      fc.property(fc.integer(), value => {
        const fab = O.Applicative.of(inc)

        assertThat(O.Applicative.ap(O.Applicative.of(value), fab)).is(
          O.Applicative.ap(
            fab,
            O.Applicative.of(f => f(value))
          )
        )
      })
    )
  })
})
