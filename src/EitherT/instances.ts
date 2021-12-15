import * as E from '../Either'
import { makeInstance, Applicative, Param, URIS, Tail, URI, UHKT, Monad, Fix } from '../hkt'

type PS<C, P extends Param> = C extends ({} | P) & infer X ? X : C

export function applicative<F extends URIS, C>(
  M: Applicative<F, C>
): Applicative<[F[0], ...Tail<F>, URI<E.EitherURI>], C>
export function applicative<F, C>(M: Applicative<UHKT<F>, C>) {
  return makeInstance<Applicative<[UHKT<F>[0], URI<E.EitherURI>], C>>({
    of: (a) => M.of(E.applicative.of(a)),
    ap: (fab, fa) =>
      M.ap(
        M.map((ab) => (ga: any) => E.applicative.ap(ab, ga), fab),
        fa
      ),

    map: (f, fa) => M.map((a) => E.applicative.map(f, a), fa),
  })
}

export function monad<F extends URIS, C>(M: Monad<F, C>): Monad<[F[0], ...Tail<F>, URI<E.EitherURI>], C>
export function monad<F, C>(M: Monad<UHKT<F>, C>) {
  const appl = applicative(M)
  return makeInstance<Monad<[UHKT<F>[0], URI<E.EitherURI>], C>>({
    ...appl,
    flatMap: (f, fa) => M.flatMap((a) => (a.isLeft() ? M.of(E.rightCast(a)) : f(a.get())), fa),
  })
}

import * as T from '../Task'
const taskEither: Monad<[URI<T.TaskURI>, URI<E.EitherURI>], Fix<'E', number>> = monad(T.monad())
const b = taskEither.of(1)
const _ad = taskEither.flatMap((b) => T.Task.done(E.right(true)), T.Task.done(E.left(1)))
const _a = taskEither.map((c) => 'foo', b)
