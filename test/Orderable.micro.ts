import { assertThat } from 'mismatched'
import * as fc from 'fast-check'
import * as Ord from '@benjstephenson/kittens-ts-core/dist/src/Orderable'
import * as M from '@benjstephenson/kittens-ts-core/dist/src/Monoid'
import * as A from '../src/Array'

describe('Orderable instances', () => {
  it('derive sortable instance', () => {
    type Cat = {
      name: string
      lives: number
    }

    const catM = Ord.getMonoid<Cat>()

    const bylives = Ord.contramap((x: Cat) => x.lives, Ord.number)
    const byName = Ord.contramap((x: Cat) => x.name, Ord.string)
    const sortableCat = M.fold(catM)([bylives, byName])

    fc.assert(
      fc.property(
        fc.tuple(fc.string(), fc.string(), fc.integer(), fc.integer()).filter(([n1, n2, a1, a2]) => n1.length < n2.length && a1 < a2),
        ([name1, name2, lives1, lives2]) => {
          const cat1: Cat = {
            name: name1,
            lives: lives1
          }

          const cat2: Cat = {
            name: name2,
            lives: lives2
          }

          assertThat(A.sort([cat2, cat1], sortableCat)).is([cat1, cat2])
        }
      )
    )
  })
})
