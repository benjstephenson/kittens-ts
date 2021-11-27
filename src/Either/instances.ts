import * as E from '.'
import { getInstance, Applicative, Apply, BiFunctor, Functor, Monad, URI } from '../hkt'

export const functor = getInstance<Functor<[URI<E.EitherURI>]>>({
  map: E.map,
})

export const bifunctor = getInstance<BiFunctor<[URI<E.EitherURI>]>>({
  bimap: (fe, fa) => (F) => F.bimap({ Left: fe, Right: fa }),
})

export const apply = getInstance<Apply<[URI<E.EitherURI>]>>({
  ...functor,
  ap: E.ap,
})

export const applicative = getInstance<Applicative<[URI<E.EitherURI>]>>({
  ...apply,
  of: E.right,
})

export const monad = getInstance<Monad<[URI<E.EitherURI>]>>({
  ...applicative,
  flatMap: E.flatMap,
})
