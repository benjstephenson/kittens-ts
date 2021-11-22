import { Either, EitherURI } from '.'
import { getInstance, Applicative, Apply, BiFunctor, Functor, Monad, URI } from '../hkt'
import { Kleisli } from '../Kleisli'

export const functor = getInstance<Functor<[URI<EitherURI>]>>({
  map: (f, fa) => fa.map(f),
})

export const bifunctor = getInstance<BiFunctor<[URI<EitherURI>]>>({
  bimap: (fe, fa) => (F) => F.bimap(fe, fa),
})

export const apply = getInstance<Apply<[URI<EitherURI>]>>({
  ...functor,
  ap: (fab, fa) => fab.flatMap((ab) => fa.map((a) => ab(a))),
})

export const applicative = getInstance<Applicative<[URI<EitherURI>]>>({
  ...apply,
  of: Either.right,
})

export const monad = getInstance<Monad<[URI<EitherURI>]>>({
  ...applicative,

  pure: applicative.of,

  flatMap: (f, fa) => fa.flatMap(f),
})

export const kleisli = <E, A, B>(f: (a: A) => Either<E, B>) => {
  return Kleisli.of<[URI<EitherURI>], {}, never, never, E, A, B>(monad, f)
}
