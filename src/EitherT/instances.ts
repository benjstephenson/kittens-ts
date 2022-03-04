import { Alt as _Alt } from '../core/Alt'
import { Applicative as _Applicative } from '../core/Applicative'
import { Apply as _Apply } from '../core/Apply'
import { Functor as _Functor } from '../core/Functor'
import { Failable as _Failable } from '../core/Failable'
import { Monad as _Monad } from '../core/Monad'
import { Foldable as _Foldable } from '../core/Foldable'
import { Traversable as _Traversable } from '../core/Traversable'
import { HKT, Kind } from '../core/HKT'
import { EitherT } from '../EitherT'
import * as E from '../Either'

export function eitherT<F extends HKT>(F: _Monad<F>): _Monad<EitherT<F>> {
  return {
    ap: (fa, fab) => F.flatMap(a => F.map(ab => E._ap(a, ab), fab), fa),
    of: a => F.of(E.right(a)),
    map: (ff, faa) => F.map(aa => E._map(ff, aa), faa),

    flatMap: <R, R2, E, E2, A, B>(f: (a: A) => Kind<F, R2, never, E.Either<E2, B>>, faa: Kind<F, R, never, E.Either<E, A>>): Kind<F, R & R2, never, E.Either<E | E2, B>> =>
      F.flatMap(aa => (aa.isLeft() ? F.of(E.leftWiden(E.left(aa.value))) : f(aa.value)), faa)
  }
}
