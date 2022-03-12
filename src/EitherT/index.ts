import { HKT, Kind, Typeclass } from '../core/HKT'
import { Either } from '../Either'

export * from './instances'

export interface EitherT<F extends HKT> extends HKT, Typeclass<F> {
  readonly type: Kind<F, this['R'], unknown, Either<this['E'], this['A']>>
}
