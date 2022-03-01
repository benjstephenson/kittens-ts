import { HKT, Kind, Typeclass } from '../core/HKT'
import { Either } from '../Either'

export interface EitherT<F extends HKT> extends HKT, Typeclass<F> {
  readonly type: Kind<F, this['R'], never, Either<this['E'], this['A']>>
}
