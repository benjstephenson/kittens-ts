import { Task } from './Task'
import * as fns from './functions'
import { Applicative, HKT, Monad } from '../hkt'

export interface TaskF extends HKT {
  readonly type: Task<this['A']>
}

export const applicative: Applicative<TaskF> = {
  of: fns.of,
  ap: fns.ap,
  map: fns.map,
}

export const monad: Monad<TaskF> = {
  ...applicative,
  flatMap: fns.flatMap,
}
