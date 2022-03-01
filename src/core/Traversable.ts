import { Applicative } from './Applicative'
import { HKT, Kind, Typeclass } from './HKT'

export interface Traversable<F extends HKT> extends Typeclass<F> {
  readonly traverse: <G extends HKT>(G: Applicative<G>) => <R, E, A, B>(f: (a: A) => Kind<G, R, E, B>, fa: Kind<F, R, E, A>) => Kind<G, R, E, Kind<F, R, E, B>>
  readonly sequence: <G extends HKT>(G: Applicative<G>) => <R, E, A>(fa: Kind<F, R, E, Kind<G, R, E, A>>) => Kind<G, R, E, Kind<F, R, E, A>>
}
