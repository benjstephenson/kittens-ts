import { Task } from './Task'
import { id } from '../functions'
import { Applicative, HKT, Kind } from '../hkt'

export const of = <A>(a: A) => new Task(() => Promise.resolve(a))

export const map = <A, B>(fn: (x: A) => B, fa: Task<A>): Task<B> => new Task(() => fa.run().then(fn))
// of(() => fa.run().then((x) => fn(x)))

export const flatMap = <A, B>(fn: (x: A) => Task<B>, fa: Task<A>): Task<B> =>
  new Task(() => fa.run().then((t) => fn(t).run()))

export const ap: <A, B>(fa: Task<A>, fab: Task<(a: A) => B>) => Task<B> = (fa, fab) => flatMap((f) => map(f, fa), fab)

export const traverse2 =
  <F extends HKT>(F: Applicative<F>) =>
  <R, E, A, B>(f: (a: A) => Kind<F, R, E, B>, fa: Task<A>): Kind<F, R, E, Task<B>> => {
    return undefined as any
  }

export const traverse = <A, B>(values: A[], f: (x: A) => Task<B>): Task<B[]> =>
  new Task(() => Promise.all(values.map((x) => f(x).run())))

export const sequence = <A>(values: Task<A>[]): Task<A[]> => traverse(values, id)
