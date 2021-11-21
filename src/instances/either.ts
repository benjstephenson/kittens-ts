import { Either } from "../Either"
import { Applicative, Apply, BiFunctor, Functor, Monad } from "../hkt"
import { Kleisli } from "../Kleisli"

export const eitherFunctor: Functor<'Either'> = {
  map: <E, A, B>(f: (a: A) => B, fa: Either<E, A>): Either<E, B> => fa.map(f)
}

export const eitherBifunctor: BiFunctor<'Either'> = {
  bimap: <E, E2, A, A2>(fe: (e: E) => E2, fa: (a: A) => A2, F: Either<E, A>): Either<E2, A2> => F.bimap(fe, fa)
}

export const eitherApply: Apply<'Either'> = {
  ...eitherFunctor,
  ap: <E, A, B>(fab: Either<E, (a: A) => B>, fa: Either<E, A>): Either<E, B> => fab.flatMap(ab => fa.map(a => ab(a))),
}

export const eitherApplicative: Applicative<'Either'> = {
  ...eitherApply,
  of: <E, A>(a: A): Either<E, A> => Either.right(a)
}

export const eitherMonad: Monad<'Either'> = {
  ...eitherApplicative,

  pure: eitherApplicative.of,

  flatMap: <E, A, B>(f: (a: A) => Either<E, B>, fa: Either<E, A>): Either<E, B> => fa.flatMap(f)
}

export const eitherK = {
  of: <E, A, B>(f: (a: A) => Either<E, B>) => {
    return new Kleisli<'Either', never, never, E, A, B>(eitherMonad, f)
  }
}


