import * as E from '../Either'
import * as A from '../Array'
import * as O from '../Option'
import { Apply, getApply, identityM } from '../hkt'
import { pipe } from '../functions'

const foo = [1, 2, 3].map((x) => O.some(x))
const bar = A.sequence(O.applicative)([O.some(1), O.some(2), O.some(3)])
const a = A.traverse(O.applicative)((x) => O.some(x.toString()), [1, 2, 3])

const b = A.sequenceT(O.apply)(O.some(1), O.some(2), O.some(''), O.some(true))

const optionMonad = O.optionT(identityM)
const apply2: Apply<O.OptionF> = getApply(optionMonad)

const r = E.right([1])
const seq = E.sequence(A.applicative)(r)

const f = (x: number): E.Either<string, number> => (x > 1 ? E.left('oh dear') : E.right(x))
const g = (x: number): E.Either<boolean, string> => (x > 1 ? E.left(false) : E.right(x.toString()))

const eb = E.right<string, number>(1).flatMap(f).flatMap(g)
const ea = E.flatMap(g, E.flatMap(f, E.left<number, number>(1)))

const c = pipe(E.left<number, number>(1), E.flatMap_(f), E.flatMap_(g))
