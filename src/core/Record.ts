import { Kind, HKT } from './HKT'
import { Applicative } from './Applicative'

export const keys = <K extends string>(r: Record<K, any>): K[] => Object.keys(r) as any

export const unit: Record<string, never> = {}

// export function sequenceR<R extends Record<string, E.Either<string, any>>>(
//   record: R
// ): E.Either<string[], { [K in keyof R]: R[K] extends E.Either<string[], infer A> ? A : never }>
// export function sequenceR(record: Record<string, E.Either<string, any>>): E.Either<string[], Record<string, any>> {
//   const [head, ...tail] = Object.keys(record)

//   const initial = record[head].map(val => ({ [head]: val })).mapLeft(s => [s])

//   return tail.reduce(
//     (acc, key) => {
//       return E.match({
//         Left: err =>
//           E.match({
//             Left: errs => E.left([...errs, ...err]),
//             Right: _ => E.left([err]),
//           }, acc),
//         Right: val =>
//           E.match({
//             Left: errs => E.left(errs),
//             Right: rec => E.right({ ...rec, [key]: val }),
//           }, acc)
//       },
//         record[key]
//       )
//     },
//     initial
//   )
// }

export const traverse =
  <F extends HKT>(F: Applicative<F>) =>
  <R, E, A, B>(f: (a: A) => Kind<F, R, E, B>, ra: Record<string, A>): Kind<F, R, E, Record<string, B>> => {
    const recordKeys = keys(ra)

    if (recordKeys.length < 1) return F.of(unit)

    const initial: Kind<F, R, E, Record<string, B>> = F.of({})

    return recordKeys.reduce((acc, k) => {
      return F.ap(
        f(ra[k]),
        F.map(
          rec => (b: B) => {
            rec[k] = b
            return rec
          },
          acc
        )
      )
    }, initial)
  }

export function sequence<F extends HKT>(
  F: Applicative<F>
): <R, E, Rec extends Record<string, Kind<F, R, E, any>>>(fa: Rec) => Kind<F, R, E, { [K in keyof Rec]: Rec[K] extends Kind<F, R, E, infer A> ? A : never }>
export function sequence<F extends HKT>(F: Applicative<F>) {
  return <R, E>(fa: Record<string, Kind<F, R, E, any>>): Kind<F, R, E, Record<string, any>> => traverse(F)(x => x, fa)
}
