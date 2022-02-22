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

  static fromEither<E, A>(e: E.Either<E, A>): TaskEither<E, A> {
    return new TaskEither(T.of(e))
  }

  static fromTask<E, A>(t: T.Task<A>): TaskEither<E, A> {
    return new TaskEither(t.map((a) => E.right<E, A>(a)))
  }

  run(): Promise<E.Either<E, A>> {
    return this.task.run()
  }

  map<B>(f: (a: A) => B): TaskEither<E, B> {
    return monad.map(f, this)
  }

  mapEither<E2, B>(f: (a: A) => E.Either<E2, B>): TaskEither<E | E2, B> {
    return monad.flatMap((a) => TaskEither.fromEither(f(a)), this)
  }

  flatMap<E2, B>(f: (a: A) => TaskEither<E2, B>): TaskEither<E | E2, B> {
    return monad.flatMap(f, this)
  }
}
