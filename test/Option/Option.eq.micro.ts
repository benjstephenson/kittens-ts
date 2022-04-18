import { assertThat } from 'mismatched'
import * as O from '../../src/Option'
import * as fc from 'fast-check'

describe('Option equality laws', () => {
  it('reflexive', () => {
    fc.assert(
      fc.property(fc.integer(), value => {
        const a = O.some(value)
        assertThat(a.equals(a)).is(true)
      })
    )
  })

  it('same value', () => {
    fc.assert(
      fc.property(fc.integer(), value => {
        const a = O.some(value)
        const b = O.some(value)
        assertThat(a.equals(b)).is(true)
      })
    )
  })

  it('value', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        fc.pre(!(a === b))
        const someA = O.some(a)
        const someB = O.some(b)
        assertThat(someA.equals(someB)).is(false)
      })
    )
  })

  it('none', () => {
    fc.assert(
      fc.property(fc.integer(), value => {
        const a = O.some(value)
        assertThat(a.equals(O.none())).is(false)
      })
    )
  })
})
