import { Applicative, Apply, Functor, Monad } from "../hkt"
import { Option } from '../Option'

export const optionFunctor: Functor<'Option'> = {
  map: <A, B>(f: (a: A) => B, fa: Option<A>): Option<B> => fa.map(f)
}

export const optionApply: Apply<'Option'> = {
  ...optionFunctor,
  ap: <A, B>(fab: Option<(a: A) => B>, fa: Option<A>): Option<B> => fab.flatMap(f => fa.map(f))
}

export const optionApplicative: Applicative<'Option'> = {
  ...optionApply,
  of: <A>(a: A | undefined): Option<A> => {
    if (a === undefined) return Option.none()

    return Option.some(a)
  },
}

export const optionMonad: Monad<'Option'> = {
  ...optionApplicative,

  pure: <A>(a: A): Option<A> => Option.some(a),

  flatMap: <A, B>(f: (a: A) => Option<B>, fa: Option<A>): Option<B> => {
    return fa.flatMap(f)
  }
}
