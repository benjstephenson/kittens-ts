import { assertThat } from 'mismatched'
import * as fc from 'fast-check'
import { pipe } from '../src/functions'

describe('Either instances', () => {
  const inc = (n: number) => n + 1

  it('pipe', () => {
    fc.assert(
      fc.property(fc.integer(), (value) => {
        assertThat(pipe(value, inc, inc, inc, inc, inc)).is(value + 5)
      })
    )
  })
})
