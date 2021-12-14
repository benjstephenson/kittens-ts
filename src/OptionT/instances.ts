import * as O from '../Option'
import { makeInstance, Applicative, URIS, Tail, URI, UHKT, Monad } from '../hkt'

//type PS<C, P extends Param> = C extends ({} | P) & infer X ? X : C

export function applicative<F extends URIS, C>(M: Applicative<F, C>): Applicative<[F[0], ...Tail<F>, URI<O.OptionURI>]> //, PS<C, 'E'>>
export function applicative<F>(M: Applicative<UHKT<F>>) {
  return makeInstance<Applicative<[UHKT<F>[0], URI<O.OptionURI>]>>({
    of: (a) => M.of(O.applicative.of(a)),
    ap: (fab, fa) =>
      M.ap(
        M.map((ab) => (ga: any) => O.applicative.ap(ab, ga), fab),
        fa
      ),

    map: (f, fa) => M.map((a) => O.applicative.map(f, a), fa),
  })
}

export function monad<F extends URIS, C>(M: Monad<F, C>): Monad<[F[0], ...Tail<F>, URI<O.OptionURI>]>
export function monad<F>(M: Monad<UHKT<F>>) {
  const appl = applicative(M)
  return makeInstance<Monad<[UHKT<F>[0], URI<O.OptionURI>]>>({
    ...appl,
    //pure: appl.of,
    flatMap: (f, fa) => M.flatMap((a) => (a.isNone() ? M.of(O.none()) : f(a.get())), fa),
  })
}
