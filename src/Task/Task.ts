import { tuple } from '../functions'

export const TaskURI = 'Task'
export type TaskURI = typeof TaskURI

export class Task<A> {
  readonly _F!: TaskURI
  readonly _A!: A
  readonly tag = 'Task'

  private constructor(private thunk: () => Promise<A>) {}

  static ofPromiseCtor<A>(executor: (resolve: (x: A) => void, reject: (x: any) => void) => void): Task<A> {
    return new Task(() => new Promise(executor))
  }

  static ofCallback<A>(fn: (cb: (err: any, val: A) => void) => void): Task<A> {
    return Task.ofPromiseCtor((resolve, reject) =>
      fn((err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    )
  }

  static of<A>(fn: () => Promise<A>): Task<A> {
    return new Task(fn)
  }

  static done<A>(t: A): Task<A> {
    return new Task(() => Promise.resolve(t))
  }

  then<TResult1 = A, TResult2 = never>(
    onfulfilled: (value: A) => TResult1 | PromiseLike<TResult1>,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.thunk().then(
      (x) => onfulfilled(x),
      (rejected) => (onrejected ? onrejected(rejected) : Promise.reject<TResult2>(rejected))
    )
  }

  toPromise(): Promise<A> {
    return this.thunk()
  }

  static sequence<A>(elts: Array<Task<A>>): Task<Array<A>> {
    return Task.traverse(elts, (x) => x)
  }

  static sequenceT<A extends Array<Task<any>>>(
    ...t: A & { readonly 0: Task<any> }
  ): Task<{ [K in keyof A]: [A[K]] extends [Task<infer U>] ? U : never }>
  static sequenceT<U>(...list: Array<Task<U>>) {
    return Task.sequence(list).map((results) => {
      const [head, ...tail] = results
      return tail.reduce<any>((acc, cur) => tuple(...acc, cur), tuple(head))
    })
  }

  static traverse<A, U>(elts: Array<A>, fn: (x: A) => Task<U>): Task<Array<U>> {
    return new Task(() => Promise.all(elts.map((x) => fn(x).toPromise())))
  }

  static liftAp<A, B>(fn: (x: A) => B): (x: { [K in keyof A]: Task<A[K]> }) => Task<B> {
    return (x) => {
      const fieldNames: Array<keyof A> = <any>Object.keys(x)
      const promisesAr = fieldNames.map((n) => x[n])
      let i = 0
      return new Task(() =>
        Promise.all(promisesAr).then((resultAr) =>
          resultAr.reduce<{ [K in keyof A]: A[K] }>((sofar, cur) => {
            sofar[fieldNames[i++]] = cur
            return sofar
          }, <any>{})
        )
      ).map(fn)
    }
  }

  static liftA2<R1, R2, V>(fn: (v1: R1, v2: R2) => V): (p1: Task<R1>, p2: Task<R2>) => Task<V> {
    return (p1, p2) => p1.flatMap((a1) => p2.map((a2) => fn(a1, a2)))
  }

  static lift<T extends any[], A>(fn: (...args: T) => Promise<A>): (...args: T) => Task<A> {
    return (...args: T) => Task.of(() => fn(...args))
  }

  map<B>(fn: (x: A) => B): Task<B> {
    return new Task<B>(() => this.thunk().then((x) => fn(x)))
  }

  flatMap<B>(fn: (x: A) => Task<B>): Task<B> {
    return Task.of(() => this.toPromise().then((t) => fn(t).toPromise()))
  }

  transform<B>(fn: (x: Task<A>) => B): B {
    return fn(this)
  }
}
