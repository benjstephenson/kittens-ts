import { assertThat } from 'mismatched'
import * as O from '../../src/Option'
import * as fc from 'fast-check'

describe('Option', () => {
  describe('Some', () => {
    it('isSome', () => {
      fc.assert(fc.property(fc.anything(), (value) => assertThat(O.some(value).isSome()).is(true)))
    })

    it('isNone', () => {
      fc.assert(fc.property(fc.anything(), (value) => assertThat(O.some(value).isNone()).is(false)))
    })

    it('get', () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const some = O.some(value) as any as O.Some<unknown>

          assertThat(some.get()).is(value)
        })
      )
    })

    it('getOrElse', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, other) => {
          const some = O.some(value)

          assertThat(some.getOrElse(other)).is(value)
        })
      )
    })

    it('map', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, other) => {
          const some = O.some(value).map((_) => other)

          if (some.isSome()) assertThat(some.get()).is(other)
          else fail('Some.map produced a None')
        })
      )
    })

    it('flatMap preserves Some', () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, other) => {
          const some = O.some(value).flatMap((_) => O.some(other))
          assertThat(O.some(value).isSome()).is(true)

          if (some.isSome()) assertThat(some.get()).is(other)
        })
      )
    })

    it('flatMap preserves returns None', () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const some = O.some(value).flatMap((_) => O.none())
          assertThat(some.isNone()).is(true)
        })
      )
    })
  })

  describe('None', () => {
    it('isSome', () => {
      assertThat(O.none().isSome()).is(false)
    })

    it('isNone', () => {
      assertThat(O.none().isNone()).is(true)
    })

    it('getOrElse', () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const none = O.none()

          assertThat(none.getOrElse(value)).is(value)
        })
      )
    })

    it('map', () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const none = O.none().map((_) => value)
          assertThat(none.isNone()).is(true)
        })
      )
    })

    it('flatMap preserves None', () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const none = O.none().flatMap((_) => O.some(value))
          assertThat(none.isNone()).is(true)
        })
      )
    })

    it('flatMap returns None', () => {
      const none = O.none().flatMap((_) => O.none())
      assertThat(none.isNone()).is(true)
    })
  })
})
