import { assertThat } from 'mismatched'
import * as fc from 'fast-check'
import * as A from '../../src/Array'
import * as O from '../../src/Option'
import * as E from '../../src/Either'
import { getCompose } from '../../src/core/Compose'
import { pipe } from '../../src/core/functions'

describe('Array', () => {
  it('sequences a tuple', () => {
    fc.assert(
      fc.property(fc.integer(), fc.boolean(), fc.string(), (num, bool, str) => {
        const tupled = A.sequenceT(O.Apply)(O.some(num), O.some(bool), O.some(str))
        assertThat(tupled).is(O.some([num, bool, str]))
      })
    )
  })

  describe('traversable laws', () => {
    it('identity', () => {
      // u.traverse(F, F.of) === F.of(u)
      fc.assert(
        fc.property(fc.integer(), fc.integer(), fc.integer(), (num, num2, num3) => {
          const array = [O.some(num), O.some(num2), O.some(num3)]

          assertThat(A.traverse(O.Applicative)(O.Applicative.of)(array)).is(O.Applicative.of(array))
        })
      )
    })

    it('naturality', () => {
      // t(u.sequence(F)) === u.traverse(G, t)
      fc.assert(
        fc.property(fc.integer(), fc.integer(), fc.integer(), (num, num2, num3) => {
          const transformation = <A>(x: O.Option<A>) => x.map(E.right).getOrElse(E.left('oops'))

          const array = [O.some(num), O.some(num2), O.some(num3)]

          assertThat(transformation(A.sequence(O.Applicative)(array))).is(A.traverse(E.Applicative)(transformation)(array))
        })
      )
    })

    it('composition', () => {
      // t (F (G a)) -> Compose F G (t a)
      // u.map(Comp).sequence(Comp) ===
      //   Comp(u.sequence(F)
      //         .map(x => x.sequence(G)))
      // Or :
      // traversal in F[_] followed by traversal in G[_] is the same as
      // one traversal in the composite Applicative F[G[_]].F

      fc.assert(
        fc.property(fc.integer(), fc.integer(), fc.integer(), (num, num2, num3) => {
          const compose = getCompose(O.Applicative, E.Applicative)
          const array = [O.some(E.right(num)), O.some(E.right(num2)), O.some(E.right(num3))]

          assertThat(O.map(A.sequence(E.Applicative))(pipe(array, A.sequence(O.Applicative)))).is(A.sequence(compose)(array))
        })
      )
    })
  })
})
