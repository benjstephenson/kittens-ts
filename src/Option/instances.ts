import { getInstance, Applicative, Apply, Eq, Functor, Monad, URI } from '../hkt'
import * as O from '.'

export const functor = getInstance<Functor<[URI<O.OptionURI>]>>({
  map: O.map,
})

export const apply = getInstance<Apply<[URI<O.OptionURI>]>>({
  ...functor,
  ap: O.ap,
})

export const applicative = getInstance<Applicative<[URI<O.OptionURI>]>>({
  ...apply,
  of: O.of,
})

export const monad = getInstance<Monad<[URI<O.OptionURI>]>>({
  ...applicative,

  flatMap: O.flatMap,
})

export const eq = <A>(E: Eq<A>): Eq<O.Option<A>> =>
  getInstance({
    equals: (a, b) => (a.isNone() && b.isNone()) || a.flatMap((av) => b.map((bv) => E.equals(av, bv))).getOrElse(false),
  })
