import { Either, Left, Right } from './Either'

export const left: <E, A>(l: E) => Either<E, A> = (l) => new Left(l)

export const right: <E, A>(r: A) => Either<E, A> = (r) => new Right(r)

export const rightCast: <E, A, AA>(e: Left<E, A>) => Left<E, AA> = (e) => e as any

export const ap: <E, A, B>(fab: Either<E, (a: A) => B>, fa: Either<E, A>) => Either<E, B> = (fab, fa) =>
  flatMap(_map(fa), fab)
export const ap_: <E, A, B>(fab: Either<E, (a: A) => B>) => (fa: Either<E, A>) => Either<E, B> = (fab) => (fa) =>
  ap(fab, fa)
export const _ap: <E, A>(fa: Either<E, A>) => <B>(fab: Either<E, (a: A) => B>) => Either<E, B> = (fa) => (fab) =>
  ap(fab, fa)

export const map: <E, A, B>(f: (a: A) => B, fa: Either<E, A>) => Either<E, B> = (f, fa) =>
  fa.isRight() ? right(f(fa.get())) : left(fa.get())
export const map_: <A, B>(f: (a: A) => B) => <E>(fa: Either<E, A>) => Either<E, B> = (f) => (fa) => map(f, fa)
export const _map: <E, A>(fa: Either<E, A>) => <B>(f: (a: A) => B) => Either<E, B> = (fa) => (f) => map(f, fa)

export const flatMap: <E, A, B>(f: (a: A) => Either<E, B>, fa: Either<E, A>) => Either<E, B> = (f, fa) =>
  fa.isLeft() ? rightCast(fa) : f(fa.get())
export const flatMap_: <E, A, B>(f: (a: A) => Either<E, B>) => (fa: Either<E, A>) => Either<E, B> = (f) => (fa) =>
  flatMap(f, fa)
export const _flatMap: <E, A>(fa: Either<E, A>) => <B>(f: (a: A) => Either<E, B>) => Either<E, B> = (fa) => (f) =>
  flatMap(f, fa)

export const bimap: <E, EE, A, AA>(
  fo: { Left: (e: E) => EE; Right: (a: A) => AA },
  fa: Either<E, A>
) => Either<EE, AA> = (fo, fa) => (fa.isLeft() ? left(fo.Left(fa.get())) : right(fo.Right(fa.get())))

export const bimap_: <E, EE, A, AA>(fo: {
  Left: (e: E) => EE
  Right: (a: A) => AA
}) => (fa: Either<E, A>) => Either<EE, AA> = (fo) => (fa) => bimap(fo, fa)
export const _bimap: <E, A>(
  fa: Either<E, A>
) => <EE, AA>(fo: { Left: (e: E) => EE; Right: (a: A) => AA }) => Either<EE, AA> = (fa) => (fo) => bimap(fo, fa)
