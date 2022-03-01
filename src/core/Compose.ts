import { Applicative } from './Applicative'
import { HKT, Kind } from './HKT'

export interface Compose<F extends HKT, G extends HKT> extends HKT {
  readonly type: Kind<F, this['R'], this['E'], Kind<G, this['R'], this['E'], this['A']>>
}

export interface ComposeF<F extends HKT, G extends HKT> extends HKT {
  readonly type: Kind<F, this['R'], this['E'], Kind<G, this['R'], this['E'], this['A']>>
}

export const getCompose = <F extends HKT, G extends HKT>(F: Applicative<F>, G: Applicative<G>): Applicative<Compose<F, G>> => ({
  of: a => F.of(G.of(a)),
  ap: <R, R2, E, E2, A, B>(fga: Kind<F, R, E, Kind<G, R, E, A>>, fgab: Kind<F, R2, E2, Kind<G, R2, E2, (a: A) => B>>) =>
    F.ap(
      fgab,
      F.map(ga => f => G.ap(ga, f), fga)
    ),

  map: (fg, fga) => F.map(ga => G.map(fg, ga), fga)
})
