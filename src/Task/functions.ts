import { Task } from './Task'
import { id } from '../functions'

export const of = <A>(thunk: () => Promise<A>) => new Task(thunk)

export const map = <A, B>(fn: (x: A) => B, fa: Task<A>): Task<B> => of(() => fa.run().then((x) => fn(x)))

export const flatMap = <A, B>(fn: (x: A) => Task<B>, fa: Task<A>): Task<B> =>
  of(() => fa.run().then((t) => fn(t).run()))

export const traverse = <A, B>(values: A[], f: (x: A) => Task<B>): Task<B[]> =>
  of(() => Promise.all(values.map((x) => f(x).run())))

export const sequence = <A>(values: Task<A>[]): Task<A[]> => traverse(values, id)
