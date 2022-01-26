import { assertThat } from 'mismatched'
import * as E from '../../src/Either'
import * as fc from 'fast-check'

describe('Either', () => {
  describe('Right', () => {
    it('isRight', () => {
      fc.assert(fc.property(fc.anything(), (value) => assertThat(E.right(value).isRight()).is(true)))
    })

    it('isLeft', () => {
      fc.assert(fc.property(fc.anything(), (value) => assertThat(E.right(value).isLeft()).is(false)))
    })

    it('get', () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const right = E.right(value)

          assertThat(right.get()).is(value)
        })
      )
    })

    it('map', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, other) => {
          const result = E.right(value).map((_) => other)

          if (result.isRight()) assertThat(result.get()).is(other)
          else fail('Right.map produced a Left')
        })
      )
    })

    it('flatMap preserves Right', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, other) => {
          const some = E.right(value).flatMap((_) => E.right(other))
          assertThat(some.get()).is(other)
        })
      )
    })

    it('flatMap preserves Left', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, other) => {
          const some = E.right(value).flatMap((_) => E.left(other))
          assertThat(some.get()).is(other)
        })
      )
    })
  })

  describe('Left', () => {
    it('isRight', () => {
      fc.assert(fc.property(fc.anything(), (value) => assertThat(E.left(value).isRight()).is(false)))
    })

    it('isLeft', () => {
      fc.assert(fc.property(fc.anything(), (value) => assertThat(E.left(value).isLeft()).is(true)))
    })

    it('getOrElse', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, other) => {
          const left = E.left(value)
          assertThat(left.getOrElse(other)).is(other)
        })
      )
    })

    it('map', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, other) => {
          const left = E.left(value).map((_) => other)
          assertThat(left.get()).is(value)
        })
      )
    })

    it('flatMap preserves Left', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, other) => {
          const none = E.left(value).flatMap((_) => E.left(other))
          assertThat(none.get()).is(value)
        })
      )
    })
  })
})
