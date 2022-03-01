import { Task } from './Task'
import { id, pipe } from '../core/functions'

export const of = <A>(a: A) => new Task(() => Promise.resolve(a))

export const map =
  <A, B>(f: (x: A) => B) =>
  (fa: Task<A>): Task<B> =>
    new Task(() => fa.run().then(f))

export const _map = <A, B>(f: (x: A) => B, fa: Task<A>): Task<B> => pipe(fa, map(f))

export const flatMap =
  <A, B>(f: (x: A) => Task<B>) =>
  (fa: Task<A>): Task<B> =>
    new Task(() => fa.run().then(t => f(t).run()))

export const _flatMap = <A, B>(f: (x: A) => Task<B>, fa: Task<A>): Task<B> => pipe(fa, flatMap(f))

export const ap =
  <A, B>(fa: Task<A>) =>
  (fab: Task<(a: A) => B>): Task<B> =>
    pipe(
      fab,
      flatMap(f => pipe(fa, map(f)))
    )

export const _ap = <A, B>(fa: Task<A>, fab: Task<(a: A) => B>): Task<B> => pipe(fab, ap(fa))

export const traverse =
  <A, B>(f: (x: A) => Task<B>) =>
  (values: A[]): Task<B[]> =>
    new Task(() => Promise.all(values.map(x => f(x).run())))

export const _traverse = <A, B>(f: (x: A) => Task<B>, values: A[]): Task<B[]> => pipe(values, traverse(f))

export const sequence = <A>(values: Task<A>[]): Task<A[]> => pipe(values, traverse(id))
