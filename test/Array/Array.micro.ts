import { assertThat, match } from 'mismatched'
import * as fc from 'fast-check'
import * as A from '../../src/Array'
import * as O from '../../src/Option'
import * as Ord from '../../src/core/Orderable'

describe('Array', () => {
  const sort = A.sort(Ord.number)

  it('sequences a tuple', () => {
    fc.assert(
      fc.property(fc.integer(), fc.boolean(), fc.string(), (num, bool, str) => {
        const tupled = A.sequenceT(O.Apply)(O.some(num), O.some(bool), O.some(str))
        assertThat(tupled).is(O.some([num, bool, str]))
      })
    )
  })

  describe('sortable', () => {
    it('keeps all elements', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), arr => {
          const sorted = sort(arr)

          assertThat(sorted.length).is(arr.length)
          assertThat(sorted).is(match.array.unorderedContains(arr))
        })
      )
    })

    it('idempotent', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), arr => {
          const sorted = sort(arr)

          assertThat(sorted).is(sort(sorted))
        })
      )
    })
  })
})
