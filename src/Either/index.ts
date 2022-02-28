import { HKT, Kind, Typeclass } from '@benjstephenson/kittens-ts-core/dist/src/HKT'
import { Either } from './Either'

export * from './instances'
export * from './functions'
export * from './Either'

export interface Eitherable<F extends HKT> extends Typeclass<F> {
  readonly toEither: <R, E, A>(fa: Kind<F, R, E, A>) => Kind<F, R, never, Either<E, A>>
}
