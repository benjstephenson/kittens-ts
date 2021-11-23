export type Option<A> = Some<A> | None<A>
export const OptionURI = 'Option'
export type OptionURI = typeof OptionURI

export const Option = {
  none: <A>(): Option<A> => new None(),
  some: <A>(a: A): Option<A> => new Some(a),
}

class Some<A> {
  readonly _URI!: OptionURI
  readonly _A!: A
  readonly tag = 'Some'

  constructor(private readonly value: A) {}

  isSome(): this is Some<A> {
    return true
  }
  isNone(): this is None<A> {
    return false
  }

  get(): A {
    return this.value
  }

  map<B>(f: (a: A) => B): Option<B> {
    return new Some(f(this.value))
  }

  flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return f(this.value)
  }

  getOrElse(_default: A): A {
    return this.value
  }
}

class None<A> {
  readonly _URI!: OptionURI
  readonly _A!: never
  readonly tag = 'None'

  isSome(): this is Some<A> {
    return false
  }
  isNone(): this is None<A> {
    return true
  }

  map<B>(_f: (a: A) => B): Option<B> {
    return new None()
  }

  flatMap<B>(_f: (a: A) => Option<B>): Option<B> {
    return new None()
  }

  getOrElse(fallback: A): A {
    return fallback
  }
}
