import { pipe } from '../core/functions'
import { Lazy } from '../core/types'
import * as fns from './functions'

/*
 * Represents a computation that *cannot* fail
 */
export class Task<A> {
  constructor(private readonly thunk: Lazy<Promise<A>>) {}

  static of<A>(a: A): Task<A> {
    return fns.of(a)
  }

  run(): Promise<A> {
    return this.thunk()
  }

  get(): Lazy<Promise<A>> {
    return this.thunk
  }

  // from prelude-ts
  // allow this Task to be thenable so can be awaited
  then<TResult1 = A, TResult2 = never>(
    onResolved: (value: A) => TResult1 | PromiseLike<TResult1>,
    onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.thunk().then(
      x => onResolved(x),
      rejected => (onRejected ? onRejected(rejected) : Promise.reject<TResult2>(rejected))
    )
  }

  map<B>(f: (a: A) => B): Task<B> {
    return pipe(this, fns.map(f))
  }

  flatMap<B>(f: (a: A) => Task<B>): Task<B> {
    return pipe(this, fns.flatMap(f))
  }
}
