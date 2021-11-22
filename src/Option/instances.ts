import { getInstance, Applicative, Apply, Functor, Monad, URI } from '../hkt'
import { Option, OptionURI } from '.'

export const functor = getInstance<Functor<[URI<OptionURI>]>>({
  map: (f, fa) => fa.map(f),
})

export const apply = getInstance<Apply<[URI<OptionURI>]>>({
  ...functor,
  ap: (fab, fa) => fab.flatMap((f) => fa.map(f)),
})

export const applicative = getInstance<Applicative<[URI<OptionURI>]>>({
  ...apply,
  of: <A>(a: A | undefined): Option<A> => {
    if (a === undefined) return Option.none()

    return Option.some(a)
  },
})

export const monad = getInstance<Monad<[URI<OptionURI>]>>({
  ...applicative,

  pure: <A>(a: A): Option<A> => Option.some(a),

  flatMap: (f, fa) => fa.flatMap(f),
})
