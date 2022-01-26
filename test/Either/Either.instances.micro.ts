import { assertThat } from 'mismatched'
import * as E from '../../src/Either'
import * as fc from 'fast-check'
import { id } from '../../src/functions'

describe('Either instances', () => {
  const inc = (n: number) => n + 1

  describe('functor laws', () => {
    it('identity', () => {
      fc.assert(
        fc.property(fc.integer(), (value) => {
          const right = E.right(value)
          assertThat(E.functor.map(id, right)).is(right)
        })
      )
    })

    it('composition', () => {
      fc.assert(
        fc.property(fc.integer(), (value) => {
          const some = E.right(value)

          assertThat(E.functor.map(inc, E.functor.map(inc, some))).is(E.functor.map((x) => inc(inc(x)), some))
        })
      )
    })
  })

  describe('applicative laws', () => {
    it('identity', () => {
      fc.assert(
        fc.property(fc.integer(), (value) => {
          const some = E.right(value)

          assertThat(
            E.applicative.ap(
              some,
              E.applicative.of((x) => x)
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
          assertThat(E.applicative.ap(E.applicative.of(value), E.applicative.of(inc))).is(E.applicative.of(inc(value)))
        })
      )
    })

    it('interchange', () => {
      // we can lift value and and apply it to the function in fab
      // or we can lift f => f(value) and apply the function in fab to that
      // i.e ap just applies the rhs to lhs; no special handling of either
      fc.assert(
        fc.property(fc.integer(), (value) => {
          const fab = E.applicative.of(inc)

          assertThat(E.applicative.ap(E.applicative.of(value), fab)).is(
            E.applicative.ap(
              fab,
              E.applicative.of((f) => f(value))
            )
          )
        })
      )
    })
  })

  describe('monadic laws', () => {
    const f = (x: number) => E.monad.of(inc(x))

    it('left identity', () => {
      fc.assert(
        fc.property(fc.integer(), (value) => {
          const pure = E.monad.of(value)

          assertThat(E.monad.flatMap(f, pure)).is(f(value))
        })
      )
    })

    it('right identity', () => {
      fc.assert(
        fc.property(fc.integer(), (value) => {
          const pure = E.monad.of(value)

          assertThat(E.monad.flatMap(E.monad.of, pure)).is(pure)
        })
      )
    })

    it('associativity', () => {
      fc.assert(
        fc.property(fc.integer(), (a) => {
          const pure = E.monad.of(a)

          assertThat(E.monad.flatMap(f, E.monad.flatMap(f, pure))).is(
            E.monad.flatMap((x) => E.monad.flatMap(f, f(x)), pure)
          )
        })
      )
    })
  })
})
