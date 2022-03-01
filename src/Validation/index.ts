import * as A from '../Array'
import * as NEL from '../NonEmptyArray'
import * as R from '@benjstephenson/kittens-ts-core/dist/src/Record'
import { Semigroup } from '@benjstephenson/kittens-ts-core/dist/src/Semigroup'
import { Apply } from '@benjstephenson/kittens-ts-core/dist/src/Apply'
import { Monad } from '@benjstephenson/kittens-ts-core/dist/src/Monad'
import { Failable } from '@benjstephenson/kittens-ts-core/dist/src/Failable'
import { HKT, Kind } from '@benjstephenson/kittens-ts-core/dist/src/HKT'
import * as E from '../Either'

export interface Validation<F extends HKT, E> extends HKT {
  readonly type: Kind<F, this['R'], E, this['A']>
}

const getZippable =
  <F extends HKT>(F: Apply<F>) =>
  <R, R1, E, E1, A, A1>(fa: Kind<F, R, E, A>, fb: Kind<F, R1, E1, A1>) =>
    F.ap(
      fa,
      F.map(b => (a: A) => [a, b] as const, fb)
    )

export const getMonadValidation =
  <F extends HKT>(M: Monad<F>, F: Failable<F>, E: E.Eitherable<F>) =>
  <Z>(S: Semigroup<Z>): Monad<Validation<F, Z>> => {
    const zip = getZippable(M)

    return {
      of: M.of,
      map: M.map,
      flatMap: M.flatMap,
      ap: (fa, fab) =>
        M.flatMap(([ea, efab]) => {
          if (ea.isLeft() && efab.isLeft()) return F.fail(S.concat(ea.get(), efab.get()))
          else if (ea.isLeft()) return F.fail(ea.get())
          else if (efab.isLeft()) return F.fail(efab.get())
          else return M.of(efab.get()(ea.get()))
        }, zip(E.toEither(fa), E.toEither(fab)))
    }
  }

export const getEitherValidation = <A>() => getMonadValidation(E.monad, E.failable, E.eitherable)(NEL.semigroup<A>())

export const getValidationNel = <A>() => A.sequenceT(getEitherValidation<A>())

export const getRecordValidation = <A>() => R.sequence(getEitherValidation<A>())
