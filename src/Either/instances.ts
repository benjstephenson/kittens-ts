// import * as E from '.'
// import { makeInstance, Applicative, Apply, BiFunctor, Functor, Monad, URI } from '../hkt'

// export const functor = makeInstance<Functor<[URI<E.EitherURI>]>>({
//   map: E.map,
// })

// export const bifunctor = makeInstance<BiFunctor<[URI<E.EitherURI>]>>({
//   bimap: (fe, fa) => (F) => F.bimap({ Left: fe, Right: fa }),
// })

// export const apply = makeInstance<Apply<[URI<E.EitherURI>]>>({
//   ...functor,
//   ap: E.ap,
// })

// export const applicative = makeInstance<Applicative<[URI<E.EitherURI>]>>({
//   ...apply,
//   of: E.right,
// })

// export const monad = makeInstance<Monad<[URI<E.EitherURI>]>>({
//   ...applicative,
//   flatMap: E.flatMap,
//})
