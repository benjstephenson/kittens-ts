import { Task } from './Task'
import * as fns from './functions'
import { HKT } from '../core/HKT'
import { Applicative as _Applicative } from '../core/Applicative'
import { Apply as _Apply } from '../core/Apply'
import { Functor as _Functor } from '../core/Functor'
import { Monad as _Monad } from '../core/Monad'

export interface TaskF extends HKT {
  readonly type: Task<this['A']>
}

export const Functor: _Functor<TaskF> = {
  map: fns._map
}

export const Apply: _Apply<TaskF> = {
  ...Functor,
  ap: fns._ap
}

export const Applicative: _Applicative<TaskF> = {
  ...Apply,
  of: fns.of
}

export const Monad: _Monad<TaskF> = {
  ...Applicative,
  flatMap: fns._flatMap
}
