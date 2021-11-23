import { Either } from '../Either'
import { URIS, Monad, Type } from '../hkt'
import { kleisli } from '../Either'

export class Kleisli<F extends URIS, A, B, C, S = never, R = never, E = never> {
  private constructor(private readonly m: Monad<F, C>, private readonly run: (a: A) => Type<F, C, S, R, E, B>) {}

  static of<F extends URIS, A, B, C, S = never, R = never, E = never>(
    M: Monad<F, C>,
    run: (a: A) => Type<F, C, S, R, E, B>
  ) {
    return new Kleisli(M, run)
  }

  andThen<BB>(k: Kleisli<F, B, BB, C>) {
    return new Kleisli(this.m, (a: A) => this.m.flatMap(k.run, this.run(a)))
  }

  apply(a: A): Type<F, {}, S, R, E, B> {
    return this.run(a)
  }
}

const a = kleisli(
  (a: number): Either<string, number> => (a < 1 ? Either.left<string, number>('oops') : Either.right<string, number>(a))
)
const b = kleisli((a: number): Either<string, string> => (a < 1 ? Either.left('oops') : Either.right(a.toString())))

a.andThen(b).apply(1)
