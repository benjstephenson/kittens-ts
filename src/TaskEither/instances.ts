import * as E from '../Either'
import * as T from '../Task'
import { HKT, Monad } from '../hkt'
import { TaskEither } from './TaskEither'

export interface TaskEitherF extends HKT {
  readonly type: T.Task<E.Either<this['E'], this['A']>>
}

export const monad: Monad<TaskEitherF> = E.eitherT(T.monad)
