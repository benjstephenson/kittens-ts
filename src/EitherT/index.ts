import { HKT, Kind, Typeclass } from '@benjstephenson/kittens-ts-core/dist/src/HKT'
import { Either } from '../Either'

export interface EitherT<F extends HKT> extends HKT, Typeclass<F> {
  readonly type: Kind<F, this['R'], never, Either<this['E'], this['A']>>
}
