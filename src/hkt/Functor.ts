import { Either } from '../Either'
import { HKT, Kind, Typeclass } from './hkt'

export interface Semigroup<A> {
  readonly concat: (a: A, b: A) => A
}

export interface Monoid<A> {
  readonly empty: A
}

export interface Functor<F extends HKT> extends Typeclass<F> {
  readonly map: <R, E, A, B>(f: (a: A) => B, fa: Kind<F, R, E, A>) => Kind<F, R, E, B>
}

export interface Apply<F extends HKT> extends Typeclass<F>, Functor<F> {
  readonly ap: <R, R2, E, E2, A, B>(
    fa: Kind<F, R, E, A>,
    fab: Kind<F, R2, E2, (a: A) => B>
  ) => Kind<F, R & R2, E | E2, B>
}

export const getApplySemigroup =
  <F extends HKT, R, E>(F: Apply<F>) =>
  <A>(S: Semigroup<A>): Semigroup<Kind<F, R, E, A>> => ({
    concat: (x, y) =>
      F.ap(
        y,
        F.map((a) => (b) => S.concat(a, b), x)
      ),
  })

export const widenFA = <F extends HKT, R, E, A, A2>(self: Kind<F, R, E, A>): Kind<F, R, E, A2> => self as any

export interface Applicative<F extends HKT> extends Typeclass<F>, Apply<F> {
  readonly of: <A>(a: A) => Kind<F, unknown, never, A>
}

export interface Monad<F extends HKT> extends Typeclass<F>, Applicative<F>, Apply<F> {
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

export const MonadId: Monad<IdF> = {
  ap: (fa, fab) => fab(fa),
  of: (a) => a,
  map: (f, a) => f(a),
  flatMap: (f, a) => f(a),
}

export interface EitherT<F extends HKT> extends HKT {
  readonly type: Kind<F, this['R'], never, Either<this['E'], this['A']>>
}
