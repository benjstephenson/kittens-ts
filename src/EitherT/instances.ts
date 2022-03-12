import { Alt as _Alt } from '../core/Alt'
import { Applicative as _Applicative } from '../core/Applicative'
import { Apply as _Apply } from '../core/Apply'
import { Functor as _Functor } from '../core/Functor'
import { Failable as _Failable } from '../core/Failable'
import { Monad as _Monad, Monad2 as _Monad2 } from '../core/Monad'
import { Foldable as _Foldable } from '../core/Foldable'
import { Traversable as _Traversable } from '../core/Traversable'
import { HKT } from '../core/HKT'
import { EitherT } from '../EitherT'
import * as E from '../Either'

export function eitherT<F extends HKT>(F: _Monad<F>): _Monad<EitherT<F>> {
  return {
    ap: (fa, fab) => F.flatMap(a => F.map(ab => E._ap(a, ab), fab), fa),
    of: a => F.of(E.right(a)),
    map: (ff, faa) => F.map(aa => E._map(ff, aa), faa),

    flatMap: (f, faa) => F.flatMap(aa => (aa.isLeft() ? F.of(E.leftWiden(E.left(aa.value))) : f(aa.value)), faa)
  }
}

export function eitherT2<F extends HKT>(F: _Monad2<F>): _Monad2<EitherT<F>> {
  return {
    ap: (fa, fab) => F.flatMap(a => F.map(ab => E._ap(a, ab), fab), fa),
    of: a => F.of(E.right(a)),
    map: (ff, faa) => F.map(aa => E._map(ff, aa), faa),
    map_: ff => F.map_(E.map(ff)),

    flatMap: (f, faa) => F.flatMap(aa => (aa.isLeft() ? F.of(E.leftWiden(E.left(aa.value))) : f(aa.value)), faa)
  }
}
