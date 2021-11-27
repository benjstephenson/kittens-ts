import { assertThat } from 'mismatched'
import * as O from '../../src/Option'
import * as fc from 'fast-check'
import { id } from '../../src/functions'

describe('Option instances', () => {
  describe('functor laws', () => {
    const inc = (n: number) => n + 1

    it('identity', () => {
      fc.assert(
        fc.property(fc.integer(), (value) => {
          const some = O.some(value)
          assertThat(O.functor.map(id, some)).is(some)
        })
      )
    })

    it('composition', () => {
      fc.assert(
        fc.property(fc.integer(), (value) => {
          const some = O.some(value)

          O.functor.map(inc, O.functor.map(inc, some))

          assertThat(O.functor.map(inc, O.functor.map(inc, some))).is(O.functor.map((x) => inc(inc(x)), some))
        })
      )
    })
  })
})
