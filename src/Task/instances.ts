import { Task } from './Task'
import * as fns from './functions'
import { HKT } from '@benjstephenson/kittens-ts-core/dist/src/HKT'
import { Applicative } from '@benjstephenson/kittens-ts-core/dist/src/Applicative'
import { Monad } from '@benjstephenson/kittens-ts-core/dist/src/Monad'

export interface TaskF extends HKT {
  readonly type: Task<this['A']>
}

export const applicative: Applicative<TaskF> = {
  of: fns.of,
  ap: fns._ap,
  map: fns._map
}

export const monad: Monad<TaskF> = {
  ...applicative,
  flatMap: fns._flatMap
}
