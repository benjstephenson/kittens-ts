import { assertThat } from 'mismatched'
import * as fc from 'fast-check'
import * as Eq from '../src/Equal'

describe('Equals instances', () => {
  it('numberic', () => {
    fc.assert(
      fc.property(fc.integer(), (value) => {
        assertThat(Eq.number.equals(value, value)).is(true)
      })
    )

    fc.assert(
      fc.property(
        fc.tuple(fc.integer(), fc.integer()).filter(([a, b]) => a !== b),
        ([a, b]) => {
          assertThat(Eq.number.equals(a, b)).is(false)
        }
      )
    )
  })

  it('string', () => {
    fc.assert(
      fc.property(fc.string(), (value) => {
        assertThat(Eq.string.equals(value, value)).is(true)
      })
    )

    fc.assert(
      fc.property(
        fc.tuple(fc.string(), fc.string()).filter(([a, b]) => a !== b),
        ([a, b]) => {
          assertThat(Eq.string.equals(a, b)).is(false)
        }
      )
    )
  })

  it('boolean', () => {
    fc.assert(
      fc.property(fc.boolean(), (value) => {
        assertThat(Eq.boolean.equals(value, value)).is(true)
      })
    )

    fc.assert(
      fc.property(
        fc.tuple(fc.boolean(), fc.boolean()).filter(([a, b]) => a !== b),
        ([a, b]) => {
          assertThat(Eq.boolean.equals(a, b)).is(false)
        }
      )
    )
  })

  it('date', () => {
    fc.assert(
      fc.property(fc.date(), (value) => {
        assertThat(Eq.date.equals(value, value)).is(true)
      })
    )

    fc.assert(
      fc.property(
        fc.tuple(fc.date(), fc.date()).filter(([a, b]) => a !== b),
        ([a, b]) => {
          assertThat(Eq.date.equals(a, b)).is(false)
        }
      )
    )
  })

  it('record equality', () => {
    type Cat = {
      name: string
      age: number
      birthday: Date
    }

    const catEquality = Eq.record<Cat>({
      name: Eq.string,
      age: Eq.number,
      birthday: Eq.date,
    })

    fc.assert(
      fc.property(fc.string(), fc.integer(), fc.date(), (name, age, birthday) => {
        const cat: Cat = {
          name,
          age,
          birthday,
        }

        assertThat(catEquality.equals(cat, cat)).is(true)
      })
    )
  })
})
