import { assertThat } from 'mismatched'
import * as O from '../../src/Option'
import * as fc from 'fast-check'
import { id } from '@benjstephenson/kittens-ts-core/dist/src/functions'
import { Semigroup } from '@benjstephenson/kittens-ts-core/dist/src/Semigroup'

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
          assertThat(optionSemigroup.concat(O.applicative.of(a), O.applicative.of(b))).is(optionSemigroup.concat(O.applicative.of(b), O.applicative.of(a)))
        })
      )
    })
  })

  describe('monoid laws', () => {
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

  describe('functor laws', () => {
    it('identity', () => {
      fc.assert(
        fc.property(fc.integer(), value => {
          const some = O.some(value)
          assertThat(O.functor.map(id, some)).is(some)
        })
      )
    })

    it('composition', () => {
      fc.assert(
        fc.property(fc.integer(), value => {
          const some = O.some(value)

          assertThat(O.functor.map(inc, O.functor.map(inc, some))).is(O.functor.map(x => inc(inc(x)), some))
        })
      )
    })
  })

  describe('pure laws', () => {
    it('identity', () => {
      fc.assert(
        fc.property(fc.integer(), value => {
          const some = O.some(value)

          assertThat(
            O.applicative.ap(
              some,
              O.applicative.of(x => x)
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
          assertThat(O.applicative.ap(O.applicative.of(value), O.applicative.of(inc))).is(O.applicative.of(inc(value)))
        })
      )
    })

    it('interchange', () => {
      // we can lift value and and apply it to the function in fab
      // or we can lift f => f(value) and apply the function in fab to that
      // i.e ap just applies the rhs to lhs; no special handling of either
      fc.assert(
        fc.property(fc.integer(), value => {
          const fab = O.applicative.of(inc)

          assertThat(O.applicative.ap(O.applicative.of(value), fab)).is(
            O.applicative.ap(
              fab,
              O.applicative.of(f => f(value))
            )
          )
        })
      )
    })
  })

  describe('monadic laws', () => {
    const f = (x: number) => O.monad.of(inc(x))

    it('left identity', () => {
      fc.assert(
        fc.property(fc.integer(), value => {
          const pure = O.monad.of(value)

          assertThat(O.monad.flatMap(f, pure)).is(f(value))
        })
      )
    })

    it('right identity', () => {
      fc.assert(
        fc.property(fc.integer(), value => {
          const pure = O.monad.of(value)

          assertThat(O.monad.flatMap(O.monad.of, pure)).is(pure)
        })
      )
    })

    it('associativity', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (a, b) => {
          // m.chain(f).chain(g) === m.chain(x => f(x).chain(g))
          const pure = O.monad.of(a)

          assertThat(O.monad.flatMap(f, O.monad.flatMap(f, pure))).is(O.monad.flatMap(x => O.monad.flatMap(f, f(x)), pure))
        })
      )
    })
  })

  describe('alt laws', () => {
    it('associativity', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), fc.integer(), (a, b, c) => {
          const optionA = O.of(a)
          const optionB = O.of(b)
          const optionC = O.of(c)

          assertThat(O.alt.alt(optionC, O.alt.alt(optionB, optionA))).is(O.alt.alt(O.alt.alt(optionC, optionB), optionA))
        })
      )
    })
  })
})
