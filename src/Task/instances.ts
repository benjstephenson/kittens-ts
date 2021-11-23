import { Task, TaskURI } from '.'
import { getInstance, Applicative, Apply, Functor, Monad, URI } from '../hkt'
import { Kleisli } from '../Kleisli'

export const functor = getInstance<Functor<[URI<TaskURI>]>>({
  map: (f, fa) => fa.map(f),
})

export const apply = getInstance<Apply<[URI<TaskURI>]>>({
  ...functor,
  ap: (fab, fa) => fab.flatMap((ab) => fa.map((a) => ab(a))),
})

export const applicative = getInstance<Applicative<[URI<TaskURI>]>>({
  ...apply,
  of: (a) => Task.of(() => Promise.resolve(a)),
})

export const monad = getInstance<Monad<[URI<TaskURI>]>>({
  ...applicative,

  //pure: applicative.of,

  flatMap: (f, fa) => fa.flatMap(f),
})

export const kleisli = <E, A, B>(f: (a: A) => Task<B>) => {
  return Kleisli.of<[URI<TaskURI>], {}, never, never, E, A, B>(monad, f)
}
