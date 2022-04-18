import { assertThat } from 'mismatched'
import * as O from '../../src/Option'
import * as fc from 'fast-check'
import { Semigroup } from '../../src/core/Semigroup'

describe('Option monoid laws', () => {
  const intSemigroup: Semigroup<number> = {
    concat: (a, b) => a + b
  }

  const optionSemigroup = O.getSemigroup(intSemigroup)

  it('left identity', () => {
    fc.assert(
      fc.property(fc.integer(), value => {
        const some = O.some(value)
        assertThat(optionSemigroup.concat(O.none(), some)).is(some)
      })
    )
  })

  it('right identity', () => {
    fc.assert(
      fc.property(fc.integer(), value => {
        const some = O.some(value)
        assertThat(optionSemigroup.concat(some, O.none())).is(some)
      })
    )
  })

  it('both something', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        const someA = O.some(a)
        const someB = O.some(b)
        assertThat(optionSemigroup.concat(someA, someB)).is(O.of(intSemigroup.concat(a, b)))
      })
    )
  })

  it('both empty', () => {
    assertThat(optionSemigroup.concat(O.none(), O.none())).is(O.none())
  })
})
