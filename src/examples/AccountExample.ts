import * as A from '../Array'
import * as O from '../Option'
import { Apply, getApply, identityM } from '../hkt'

const foo = [1, 2, 3].map((x) => O.some(x))
const bar = A.sequence(O.applicative)([O.some(1), O.some(2), O.some(3)])
const a = A.traverse(O.applicative)((x) => O.some(x.toString()), [1, 2, 3])

const optionMonad = O.optionT(identityM)
const apply2: Apply<O.OptionF> = getApply(optionMonad)
