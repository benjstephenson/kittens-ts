import { URIS, Monad, Type } from '../hkt'

export class Kleisli<F extends URIS, C, S, R, E, A, B> {
  private constructor(private readonly m: Monad<F, C>, private readonly run: (a: A) => Type<F, C, S, R, E, B>) {}

  static of<F extends URIS, C, S, R, E, A, B>(M: Monad<F, {}>, run: (a: A) => Type<F, C, S, R, E, B>) {
    return new Kleisli(M, run)
  }

  andThen<BB>(k: Kleisli<F, C, S, R, E, B, BB>) {
    return new Kleisli(this.m, (a: A) => this.m.flatMap(k.run, this.run(a)))
  }

  apply(a: A): Type<F, {}, S, R, E, B> {
    return this.run(a)
  }
}
