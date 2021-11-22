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

  map<B>(f: (a: A) => B): Some<B> {
    return new Some(f(this.value))
  }

  flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return f(this.value)
  }
}

class None<A> {
  readonly _URI!: OptionURI
  readonly _A!: never
  readonly tag = 'None'

  map<B>(_f: (a: A) => B): None<B> {
    return new None()
  }

  flatMap<B>(_f: (a: A) => Option<B>): Option<B> {
    return new None()
  }
}
