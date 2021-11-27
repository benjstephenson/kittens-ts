import { Monad, Type, URI, URIS } from '../hkt'
import * as E from '../Either'

class EitherT<F extends URIS, C, S, R, E, A> {
  //private readonly value: Type<F, C, S, R, E, E.Either<E2, A>>

  constructor(
    private readonly M: Monad<[F[0]], C>,
    private readonly value: Type<[F[0], URI<E.EitherURI>], C, S, R, E, A>
  ) {}

  static of<F extends URIS, C, A>(M: Monad<[F[0]], C>, init: A) {
    return new EitherT(M, M.of(E.applicative.of(init)))
  }

  // static from<F extends URIS, C, E2, A>(M: Monad<[F[0]], C>, init: E.Either<E2, A>) {
  //   return new EitherT(M, M.of(init))
  // }

  map<B>(f: (a: A) => B): EitherT<F, C, S, R, E, B> {
    return new EitherT(
      this.M,
      this.M.map((a) => E.applicative.map(f, a), this.value)
    )
  }

  flatMap<B>(f: (a: A) => Type<[F[0], URI<E.EitherURI>], C, S, R, E, B>) {
    //}: Type<F, C, S, R, E, E.Either<E2, B>> {
    return this.M.flatMap((a) => (a.isLeft() ? this.M.of(a as any as E.Left<any, B>) : f(a.get())), this.value)
  }
}
