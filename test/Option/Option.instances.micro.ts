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

  describe('pure laws', () => {
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

  describe('Monadic laws', () => {
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
