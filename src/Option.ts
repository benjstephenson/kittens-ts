import { Monad } from "./hkt"


export type Option<A> = Some<A> | None<A>
export const URI = 'Option'
export type URI = typeof URI

declare module './hkt' {
  interface URItoHKT<A> {
    Option: Option<A>
  }
}

export const Option = {
  none: <A>(): Option<A> => new None(),
  some: <A>(a: A): Option<A> => new Some(a)
}

export const optionMonad: Monad<URI> = {

  ap: <A, B>(fab: Option<(a: A) => B>, fa: Option<A>): Option<B> => {
    return fab.flatMap(f => fa.map(f))
  },

  of: <A>(a: A | undefined): Option<A> => {
    if (a === undefined) return new None()

    return new Some(a)
  },

  pure: <A>(a: A): Option<A> => {
    return new Some(a)
  },

  map: <A, B>(f: (a: A) => B, fa: Option<A>): Option<B> => {
    return (fa as Option<A>).map(f)
  },

  flatMap: <A, B>(f: (a: A) => Option<B>, fa: Option<A>): Option<B> => {
    return fa.flatMap(f)
  }
}


class Some<A> {

  readonly _URI!: URI
  readonly _A!: A
  readonly tag = 'Some'


  constructor(private readonly value: A) { }

  map<B>(f: (a: A) => B): Some<B> {
    return new Some(f(this.value))
  }

  flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return f(this.value)
  }
}

class None<A> {

  readonly _URI!: URI
  readonly _A!: never
  readonly tag = 'None'


  map<B>(_f: (a: A) => B): None<B> {
    return new None()
  }

  flatMap<B>(_f: (a: A) => Option<B>): Option<B> {
    return new None()
  }

}
