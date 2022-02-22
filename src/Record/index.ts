import { Applicative, Kind, HKT } from '../hkt'

export const keys = <K extends string>(r: Record<K, any>): K[] => Object.keys(r) as any

export const unit: Record<string, never> = {}

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
          (rec) => (b: B) => {
            rec[k] = b
            return rec
          },
          acc
        )
      )
    }, initial)
  }

export const sequence =
  <F extends HKT>(F: Applicative<F>) =>
  <R, E, A>(fa: Record<string, Kind<F, R, E, A>>): Kind<F, R, E, Record<string, A>> =>
    traverse(F)((x) => x, fa)
