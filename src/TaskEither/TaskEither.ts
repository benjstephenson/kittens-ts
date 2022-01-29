import * as E from '../Either'

export class TaskEither<E, A> {
  constructor(private thunk: () => Promise<E.Either<E, A>>) {}
}
