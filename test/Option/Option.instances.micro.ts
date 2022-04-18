import { assertThat } from 'mismatched'
import * as O from '../../src/Option'
import * as fc from 'fast-check'
import { id } from '../../src/core/functions'
import { Semigroup } from '../../src/core/Semigroup'

describe('Option instances', () => {
  const inc = (n: number) => n + 1
  const intSemigroup: Semigroup<number> = {
    concat: (a, b) => a + b
  }

  const optionSemigroup = O.getSemigroup(intSemigroup)

  describe('semigroup laws', () => {
    it('associativity', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (a, b) => {
          assertThat(optionSemigroup.concat(O.Applicative.of(a), O.Applicative.of(b))).is(optionSemigroup.concat(O.Applicative.of(b), O.Applicative.of(a)))
        })
      )
    })
  })

  describe('Functor laws', () => {
    it('identity', () => {
      fc.assert(
        fc.property(fc.integer(), value => {
          const some = O.some(value)
          assertThat(O.Functor.map(id, some)).is(some)
        })
      )
    })

    it('composition', () => {
      fc.assert(
        fc.property(fc.integer(), value => {
          const some = O.some(value)

          assertThat(O.Functor.map(inc, O.Functor.map(inc, some))).is(O.Functor.map(x => inc(inc(x)), some))
        })
      )
    })
  })

  describe('Alt laws', () => {
    it('associativity', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), fc.integer(), (a, b, c) => {
          const optionA = O.of(a)
          const optionB = O.of(b)
          const optionC = O.of(c)

          assertThat(O.Alt.alt(optionC, O.Alt.alt(optionB, optionA))).is(O.Alt.alt(O.Alt.alt(optionC, optionB), optionA))
        })
      )
    })
  })
})
