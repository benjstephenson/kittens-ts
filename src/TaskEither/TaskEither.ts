import * as E from '../Either'
import * as T from '../Task'

export class TaskEither<E, A> {
  constructor(private task: T.Task<E.Either<E, A>>) {}

  get(): T.Task<E.Either<E, A>> {
    return this.task
  }
}
