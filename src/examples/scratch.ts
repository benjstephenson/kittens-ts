import * as E from '../Either'
import * as A from '../Array'
import * as O from '../Option'
import * as T from '../Task'
import { Apply, getApply } from '../core/Apply'
import { pipe } from '../core/functions'
import { identityM } from '../core/Id'

const foo = [1, 2, 3].map(x => O.some(x))
const bar = A.sequence(O.Applicative)([O.some(1), O.some(2), O.some(3)])
const a = pipe(
  [1, 2, 3],
  A.traverse(O.Applicative)(x => O.some(x.toString()))
)

const b = A.sequenceT(O.Apply)(O.some(1), O.some(2), O.some(''), O.some(true))

const optionMonad = O.optionT(identityM)
const apply2: Apply<O.OptionF> = getApply(optionMonad)

const r = E.right([1])
const seq = E.sequence(A.Applicative)(r)

const f = (x: number): E.Either<string, number> => (x > 1 ? E.left('oh dear') : E.right(x))
const g = (x: number): E.Either<boolean, string> => (x > 1 ? E.left(false) : E.right(x.toString()))

const eb = E.right<string, number>(1).flatMap(f).flatMap(g)
const ea = E._flatMap(g, E._flatMap(f, E.left<number, number>(1)))

const c = pipe(E.left<number, number>(1), E.flatMap(f), E.flatMap(g))

const taskArray = [T.of(() => Promise.resolve(1))]
const traversedTask = pipe(
  taskArray,
  A.traverse(T.Applicative)(a => a.map(x => x.toString()))
)
const sequencedTask = A.sequence(T.Applicative)(taskArray)
