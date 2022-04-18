import { assertThat } from 'mismatched'
import * as O from '../../src/Option'
import * as fc from 'fast-check'

describe('Option monadic laws', () => {
  const inc = (n: number) => n + 1

  const f = (x: number) => O.Monad.of(inc(x))

  it('left identity', () => {
    fc.assert(
      fc.property(fc.integer(), value => {
        const pure = O.Monad.of(value)

        assertThat(O.Monad.flatMap(f, pure)).is(f(value))
      })
    )
  })

  it('right identity', () => {
    fc.assert(
      fc.property(fc.integer(), value => {
        const pure = O.Monad.of(value)

        assertThat(O.Monad.flatMap(O.Monad.of, pure)).is(pure)
      })
    )
  })

  it('associativity', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        // m.chain(f).chain(g) === m.chain(x => f(x).chain(g))
        const pure = O.Monad.of(a)

        assertThat(O.Monad.flatMap(f, O.Monad.flatMap(f, pure))).is(O.Monad.flatMap(x => O.Monad.flatMap(f, f(x)), pure))
      })
    )
  })
})
