import { assertThat } from 'mismatched'
import * as E from '../../src/Either'
import * as Eq from '../../src/core/Equal'
import * as fc from 'fast-check'
import { id } from '../../src/core/functions'

describe('Either instances', () => {
  const inc = (n: number) => n + 1

  describe('Equality', () => {
    it('left does not equal right', () => {
      fc.assert(
        fc.property(fc.oneof(fc.integer(), fc.boolean(), fc.string()), left => {
          const x = E.left(left)
          const y = E.right(left)

          const eitherEq = E.getEquals(Eq.withDefault(), Eq.withDefault())
          assertThat(eitherEq.equals(x, y)).withMessage('left equals right').is(false)
          assertThat(eitherEq.equals(y, x)).withMessage('left equals right').is(false)
        })
      )
    })

    it('equals left', () => {
      fc.assert(
        fc.property(fc.oneof(fc.integer(), fc.boolean(), fc.string()), left => {
          const x = E.left(left)
          const y = E.left(left)

          const eitherEq = E.getEquals(Eq.withDefault(), Eq.never())
          assertThat(eitherEq.equals(x, y)).withMessage('left is not equal').is(true)
        })
      )
    })

    it('not equals left', () => {
      fc.assert(
        fc.property(
          fc.array(fc.oneof(fc.integer(), fc.boolean(), fc.string()), { minLength: 2, maxLength: 2 }).filter(v => {
            const [first, second] = v
            return first !== second
          }),
          values => {
            const [left, left2] = values
            const x = E.left(left)
            const y = E.left(left2)

            const eitherEq = E.getEquals(Eq.withDefault(), Eq.never())
            assertThat(eitherEq.equals(x, y)).withMessage('left is equal').is(false)
          }
        )
      )
    })

    it('equals right', () => {
      fc.assert(
        fc.property(fc.oneof(fc.integer(), fc.boolean(), fc.string()), right => {
          const x = E.right(right)
          const y = E.right(right)

          const eitherEq = E.getEquals(Eq.never(), Eq.withDefault())
          assertThat(eitherEq.equals(x, y)).withMessage('right is not equal').is(true)
        })
      )
    })

    it('not equals right', () => {
      fc.assert(
        fc.property(
          fc.array(fc.oneof(fc.integer(), fc.boolean(), fc.string()), { minLength: 2, maxLength: 2 }).filter(v => {
            const [first, second] = v
            return first !== second
          }),
          values => {
            const [right, right2] = values
            const x = E.right(right)
            const y = E.right(right2)

            const eitherEq = E.getEquals(Eq.never(), Eq.withDefault())
            assertThat(eitherEq.equals(x, y)).withMessage('right is equal').is(false)
          }
        )
      )
    })
  })

  describe('Functor laws', () => {
    it('identity', () => {
      fc.assert(
        fc.property(fc.integer(), value => {
          const right = E.right(value)
          assertThat(E.Functor.map(id, right)).is(right)
        })
      )
    })

    it('composition', () => {
      fc.assert(
        fc.property(fc.integer(), value => {
          const some = E.right(value)

          assertThat(E.Functor.map(inc, E.Functor.map(inc, some))).is(E.Functor.map(x => inc(inc(x)), some))
        })
      )
    })
  })

  describe('Applicative laws', () => {
    it('identity', () => {
      fc.assert(
        fc.property(fc.integer(), value => {
          const some = E.right(value)

          assertThat(
            E.Applicative.ap(
              some,
              E.Applicative.of(x => x)
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
          assertThat(E.Applicative.ap(E.Applicative.of(value), E.Applicative.of(inc))).is(E.Applicative.of(inc(value)))
        })
      )
    })

    it('interchange', () => {
      // we can lift value and and apply it to the function in fab
      // or we can lift f => f(value) and apply the function in fab to that
      // i.e ap just applies the rhs to lhs; no special handling of either
      fc.assert(
        fc.property(fc.integer(), value => {
          const fab = E.Applicative.of(inc)

          assertThat(E.Applicative.ap(E.Applicative.of(value), fab)).is(
            E.Applicative.ap(
              fab,
              E.Applicative.of(f => f(value))
            )
          )
        })
      )
    })
  })

  describe('Monadic laws', () => {
    const f = (x: number) => E.Monad.of(inc(x))

    it('left identity', () => {
      fc.assert(
        fc.property(fc.integer(), value => {
          const pure = E.Monad.of(value)

          assertThat(E.Monad.flatMap(f, pure)).is(f(value))
        })
      )
    })

    it('right identity', () => {
      fc.assert(
        fc.property(fc.integer(), value => {
          const pure = E.Monad.of(value)

          assertThat(E.Monad.flatMap(E.Monad.of, pure)).is(pure)
        })
      )
    })

    it('associativity', () => {
      fc.assert(
        fc.property(fc.integer(), a => {
          const pure = E.Monad.of(a)

          assertThat(E.Monad.flatMap(f, E.Monad.flatMap(f, pure))).is(E.Monad.flatMap(x => E.Monad.flatMap(f, f(x)), pure))
        })
      )
    })
  })
})
