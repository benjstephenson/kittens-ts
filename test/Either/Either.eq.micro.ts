import * as fc from 'fast-check'
import { assertThat } from 'mismatched'
import * as E from '../../src/Either'

describe('Equality', () => {
  it('reflexive', () => {
    fc.assert(
      fc.property(fc.integer(), value => {
        const a = E.right(value)
        assertThat(a.equals(a)).is(true)
      })
    )
  })

  it('same value', () => {
    fc.assert(
      fc.property(fc.integer(), value => {
        const a = E.right(value)
        const b = E.right(value)
        assertThat(a.equals(b)).is(true)
      })
    )
  })

  it('value', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        fc.pre(!(a === b))
        const rightA = E.right(a)
        const rightB = E.right(b)
        assertThat(rightA.equals(rightB)).is(false)
      })
    )
  })

  it('left and right', () => {
    fc.assert(
      fc.property(fc.integer(), value => {
        const a = E.right(value)
        assertThat(a.equals(E.left(value))).is(false)
      })
    )
  })
})
