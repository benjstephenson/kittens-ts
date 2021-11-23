import { tuple } from '../functions'

export const TaskURI = 'Task'
export type TaskURI = typeof TaskURI

export class Task<T> {
  readonly _URI!: TaskURI
  readonly _A!: T
  readonly tag = 'Task'

  private constructor(private thunk: () => Promise<T>) {}

  static ofPromiseCtor<T>(executor: (resolve: (x: T) => void, reject: (x: any) => void) => void): Task<T> {
    return new Task(() => new Promise(executor))
  }

  static ofCallback<T>(fn: (cb: (err: any, val: T) => void) => void): Task<T> {
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

  static of<T>(fn: () => Promise<T>): Task<T> {
    return new Task(fn)
  }

  static done<T>(t: T): Task<T> {
    return new Task(() => Promise.resolve(t))
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled: (value: T) => TResult1 | PromiseLike<TResult1>,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.thunk().then(
      (x) => onfulfilled(x),
      (rejected) => (onrejected ? onrejected(rejected) : Promise.reject<TResult2>(rejected))
    )
  }

  toPromise(): Promise<T> {
    return this.thunk()
  }

  static sequence<T>(elts: Array<Task<T>>): Task<Array<T>> {
    return Task.traverse(elts, (x) => x)
  }

  static sequenceT<T extends Array<Task<any>>>(
    ...t: T & { readonly 0: Task<any> }
  ): Task<{ [K in keyof T]: [T[K]] extends [Task<infer U>] ? U : never }>
  static sequenceT<U>(...list: Array<Task<U>>) {
    return Task.sequence(list).map((results) => {
      const [head, ...tail] = results
      return tail.reduce<any>((acc, cur) => tuple(...acc, cur), tuple(head))
    })
  }

  static traverse<T, U>(elts: Array<T>, fn: (x: T) => Task<U>): Task<Array<U>> {
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

  static lift<T extends any[], U>(fn: (...args: T) => Promise<U>): (...args: T) => Task<U> {
    return (...args: T) => Task.of(() => fn(...args))
  }

  map<U>(fn: (x: T) => U): Task<U> {
    return new Task<U>(() => this.thunk().then((x) => fn(x)))
  }

  flatMap<U>(fn: (x: T) => Task<U>): Task<U> {
    return Task.of(() => this.toPromise().then((t) => fn(t).toPromise()))
  }

  transform<U>(fn: (x: Task<T>) => U): U {
    return fn(this)
  }
}
