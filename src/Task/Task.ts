import * as fns from './functions'

export class Task<A> {
  constructor(private readonly thunk: () => Promise<A>) {}

  static of<A>(thunk: () => Promise<A>): Task<A> {
    return new Task(thunk)
  }

  run(): Promise<A> {
    return this.thunk()
  }

  // from prelude-ts
  // allow this Task to be thenable so can be awaited
  then<TResult1 = A, TResult2 = never>(
    onfulfilled: (value: A) => TResult1 | PromiseLike<TResult1>,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.thunk().then(
      (x) => onfulfilled(x),
      (rejected) => (onrejected ? onrejected(rejected) : Promise.reject<TResult2>(rejected))
    )
  }

  map<B>(f: (a: A) => B): Task<B> {
    return fns.map(f, this)
  }

  flatMap<B>(f: (a: A) => Task<B>): Task<B> {
    return fns.flatMap(f, this)
  }
}
