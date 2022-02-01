import * as E from '../Either'
import * as T from '../Task'
import { monad } from './instances'

/*
 * Representas a computation that may fail with E
 * Ultimately this just wraps an EitherT instance but to make it friendlier for
 * those who are more used to class APIs rather than function based ones, we do a lot of
 * unboxing and reboxing in the monad contract.
 */
export class TaskEither<E, A> {
  constructor(private task: T.Task<E.Either<E, A>>) {}

  get(): T.Task<E.Either<E, A>> {
    return this.task
  }

  static of<E, A>(a: A): TaskEither<E, A> {
    return monad.of(a)
  }

  run(): Promise<E.Either<E, A>> {
    return this.task.run()
  }

  map<B>(f: (a: A) => B): TaskEither<E, B> {
    return monad.map(f, this)
  }

  flatMap<B>(f: (a: A) => TaskEither<E, B>): TaskEither<E, B> {
    return monad.flatMap(f, this)
  }
}
