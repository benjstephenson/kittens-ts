import { assertThat } from 'mismatched'
import * as O from '../../src/Option'
import * as fc from 'fast-check'
import { id } from '../../src/functions'
import { Semigroup } from '../../src/hkt'

describe('Option instances', () => {
  const inc = (n: number) => n + 1
  const intSemigroup: Semigroup<number> = {
    concat: (a, b) => a + b,
  }

  const optionConcat = O.semigroup.concat(intSemigroup)

  describe('semigroup laws', () => {
    it('associativity', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (a, b) => {
          assertThat(optionConcat(O.applicative.of(a), O.applicative.of(b))).is(
            optionConcat(O.applicative.of(b), O.applicative.of(a))
          )
        })
      )
    })
  })

  describe('monoid laws', () => {
    it('left identity', () => {
      fc.assert(
        fc.property(fc.integer(), (value) => {
          const some = O.some(value)
          assertThat(optionConcat(O.none(), some)).is(O.none())
        })
      )
    })

    it('right identity', () => {
      fc.assert(
        fc.property(fc.integer(), (value) => {
          const some = O.some(value)
          assertThat(optionConcat(some, O.none())).is(O.none())
        })
      )
    })
  })

  describe('functor laws', () => {
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

          assertThat(O.functor.map(inc, O.functor.map(inc, some))).is(O.functor.map((x) => inc(inc(x)), some))
        })
      )
    })
  })

  describe('pure laws', () => {
    it('identity', () => {
      fc.assert(
        fc.property(fc.integer(), (value) => {
          const some = O.some(value)

          assertThat(
            O.applicative.ap(
              some,
              O.applicative.of((x) => x)
            )
          ).is(some)
        })
      )
    })

    it('homomorphic', () => {
      // we can lift the func and the argument and then combine them
      // or we can combine them and then lift the result
      fc.assert(
        fc.property(fc.integer(), (value) => {
          assertThat(O.applicative.ap(O.applicative.of(value), O.applicative.of(inc))).is(O.applicative.of(inc(value)))
        })
      )
    })

    it('interchange', () => {
      // we can lift value and and apply it to the function in fab
      // or we can lift f => f(value) and apply the function in fab to that
      // i.e ap just applies the rhs to lhs; no special handling of either
      fc.assert(
        fc.property(fc.integer(), (value) => {
          const fab = O.applicative.of(inc)

          assertThat(O.applicative.ap(O.applicative.of(value), fab)).is(
            O.applicative.ap(
              fab,
              O.applicative.of((f) => f(value))
            )
          )
        })
      )
    })
  })
})
