import { makeInstance, Applicative, Apply, Eq, Functor, Monad, URI } from '../hkt'
import * as O from '.'

export const functor = makeInstance<Functor<[URI<O.OptionURI>]>>({
  map: O.map,
})

export const apply = makeInstance<Apply<[URI<O.OptionURI>]>>({
  ...functor,
  ap: O.ap,
})

export const applicative = makeInstance<Applicative<[URI<O.OptionURI>]>>({
  ...apply,
  of: O.of,
})

export const monad = makeInstance<Monad<[URI<O.OptionURI>]>>({
  ...applicative,

  flatMap: O.flatMap,
})

export const eq = <A>(E: Eq<A>): Eq<O.Option<A>> =>
  makeInstance({
    equals: (a, b) => (a.isNone() && b.isNone()) || a.flatMap((av) => b.map((bv) => E.equals(av, bv))).getOrElse(false),
  })
