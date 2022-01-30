import * as E from '../Either'
import * as T from '../Task'
import { HKT, Monad } from '../hkt'
import { TaskEither } from './TaskEither'

export interface TaskEitherF extends HKT {
  readonly type: TaskEither<this['E'], this['A']>
}

const teMonad = E.eitherT(T.monad)

export const monad: Monad<TaskEitherF> = {
  flatMap: (f, fa) => new TaskEither(teMonad.flatMap((x) => f(x).get(), fa.get())),
  of: (a) => new TaskEither(T.of(E.right(a))),
  ap: (fa, fab) => new TaskEither(teMonad.ap(fa.get(), fab.get())),
  map: (f, fa) => new TaskEither(teMonad.map(f, fa.get())),
}
