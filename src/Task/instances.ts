import { Task } from './Task'
import * as fns from './functions'
import { HKT } from '../core/HKT'
import { Applicative as _Applicative } from '../core/Applicative'
import { Monad as _Monad } from '../core/Monad'

export interface TaskF extends HKT {
  readonly type: Task<this['A']>
}

export const Applicative: _Applicative<TaskF> = {
  of: fns.of,
  ap: fns._ap,
  map: fns._map
}

export const Monad: _Monad<TaskF> = {
  ...Applicative,
  flatMap: fns._flatMap
}
