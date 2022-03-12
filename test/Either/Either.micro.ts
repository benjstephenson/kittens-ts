import { assertThat } from 'mismatched'
import * as E from '../../src/Either'
import * as fc from 'fast-check'

describe('Either', () => {
  describe('Right', () => {
    it('isRight', () => {
      fc.assert(fc.property(fc.anything(), value => assertThat(E.right(value).isRight()).is(true)))
    })

    it('isLeft', () => {
      fc.assert(fc.property(fc.anything(), value => assertThat(E.right(value).isLeft()).is(false)))
    })

    it('get', () => {
      fc.assert(
        fc.property(fc.anything(), value => {
          const right = E.right(value)

          assertThat(right.value).is(value)
        })
      )
    })

    it('map', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, other) => {
          const result = E.right(value).map(_ => other)

          if (result.isRight()) assertThat(result.value).is(other)
          else fail('Right.map produced a Left')
        })
      )
    })

    it('flatMap maps preserves Right', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, other) => {
          const either = E.right(value).flatMap(_ => E.right(other))
          assertThat(either.tag).is('Right')
          assertThat(either.value).is(other)
        })
      )
    })

    it('flatMap maps and preserves Left', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, other) => {
          const either = E.right(value).flatMap(_ => E.left(other))
          assertThat(either.tag).is('Left')
          assertThat(either.value).is(other)
        })
      )
    })

    it('flatMapLeft preserves Right', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, other) => {
          const some = E.right(value).flatMapLeft(_ => E.left(other))
          assertThat(some.tag).is('Right')
          assertThat(some.value).is(value)
        })
      )
    })
  })

  describe('Left', () => {
    it('isRight', () => {
      fc.assert(fc.property(fc.anything(), value => assertThat(E.left(value).isRight()).is(false)))
    })

    it('isLeft', () => {
      fc.assert(fc.property(fc.anything(), value => assertThat(E.left(value).isLeft()).is(true)))
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
          const left = E.left(value).map(_ => other)
          assertThat(left.value).is(value)
        })
      )
    })

    it('flatMap preserves Left', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, other) => {
          const none = E.left(value).flatMap(_ => E.left(other))
          assertThat(none.value).is(value)
        })
      )
    })

    it('flatMapLeft maps and preserves Left', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, other) => {
          const some = E.left(value).flatMapLeft(_ => E.left(other))
          assertThat(some.tag).is('Left')
          assertThat(some.value).is(other)
        })
      )
    })

    it('flatMapLeft maps and preserves Right', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, other) => {
          const some = E.left(value).flatMapLeft(_ => E.right(other))
          assertThat(some.tag).is('Right')
          assertThat(some.value).is(other)
        })
      )
    })
  })
})
