import { Either } from '../Either'
import { HKT, Kind, Typeclass } from './hkt'

export interface Functor<F extends HKT> extends Typeclass<F> {
  readonly map: <R, E, A, B>(f: (a: A) => B, fa: Kind<F, R, E, A>) => Kind<F, R, E, B>
}

export interface Apply<F extends HKT> extends Functor<F> {
  readonly ap: <R, R2, E, E2, A, B>(
    fa: Kind<F, R, E, A>,
    fab: Kind<F, R2, E2, (a: A) => B>
  ) => Kind<F, R & R2, E | E2, B>
}

export const widenFA = <F extends HKT, R, E, A, A2>(self: Kind<F, R, E, A>): Kind<F, R, E, A2> => self as any

export interface Contravariant<F extends HKT> extends Typeclass<F> {
  readonly contramap: <R, E, A, B>(f: (b: B) => A, fa: Kind<F, R, E, A>) => Kind<F, R, E, B>
}

export interface Applicative<F extends HKT> extends Apply<F> {
  readonly of: <R, E, A>(a: A) => Kind<F, R, E, A>
}

export interface Foldable<F extends HKT> extends Typeclass<F> {
  readonly fold: <R, E, A, B>(f: (acc: B, a: A) => B, init: B, fa: Kind<F, R, E, A>) => B
}

export interface Traversable<F extends HKT> extends Typeclass<F> {
  readonly traverse: <G extends HKT>(
    G: Applicative<G>
  ) => <R, E, A, B>(f: (a: A) => Kind<G, R, E, B>, fa: Kind<F, R, E, A>) => Kind<G, R, E, Kind<F, R, E, B>>
  readonly sequence: <G extends HKT>(
    G: Applicative<G>
  ) => <R, E, A>(fa: Kind<F, R, E, Kind<G, R, E, A>>) => Kind<G, R, E, Kind<F, R, E, A>>
}

export interface Monad<F extends HKT> extends Applicative<F> {
  readonly flatMap: <R, R2, E, E2, A, B>(
    f: (a: A) => Kind<F, R2, E2, B>,
    fa: Kind<F, R, E, A>
  ) => Kind<F, R & R2, E | E2, B>
}

export interface Id<A> {
  (a: A): A
}

export interface IdF extends HKT {
  readonly type: this['A']
}

export const identityM: Monad<IdF> = {
  ap: (fa, fab) => fab(fa),
  of: (a) => a,
  map: (f, a) => f(a),
  flatMap: (f, a) => f(a),
}

export interface EitherT<F extends HKT> extends HKT, Typeclass<F> {
  readonly type: Kind<F, this['R'], never, Either<this['E'], this['A']>>
}

export const getApply = <F extends HKT>(F: Monad<F>): Apply<F> => ({
  map: F.map,
  ap: F.ap,
})
