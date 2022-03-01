import { Applicative as _Applicative } from '../core/Applicative'
import { Apply as _Apply } from '../core/Apply'
import { Traversable as _Traversable } from '../core/Traversable'
import { Monoid as _Monoid } from '../core/Monoid'
import { HKT } from '../core/HKT'
import * as fns from '.'

export interface ArrayF extends HKT {
  readonly type: Array<this['A']>
}

export const Applicative: _Applicative<ArrayF> = {
  of: a => [a],
  ap: (fa, fab) => fab.flatMap(ab => fa.map(ab)),
  map: (f, fa) => fa.map(f)
}

export const Monoid = <A>(): _Monoid<Array<A>> => ({
  empty: [],
  concat: fns.concat
})

export const Traversable: _Traversable<ArrayF> = {
  traverse: fns._traverse,
  sequence: fns.sequence
}
