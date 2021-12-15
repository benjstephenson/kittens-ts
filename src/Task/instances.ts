import { Task, TaskURI } from '.'
import { makeInstance, Applicative, Apply, Functor, Monad, URI } from '../hkt'
import { Kleisli } from '../Kleisli'

export const functor = makeInstance<Functor<[URI<TaskURI>]>>({
  map: (f, fa) => fa.map(f),
})

export const apply = makeInstance<Apply<[URI<TaskURI>]>>({
  ...functor,
  ap: (fab, fa) => fab.flatMap((ab) => fa.map((a) => ab(a))),
})

export const applicative = makeInstance<Applicative<[URI<TaskURI>]>>({
  ...apply,
  of: (a) => Task.of(() => Promise.resolve(a)),
})

export const monad = <C>() =>
  makeInstance<Monad<[URI<TaskURI>], C>>({
    ...applicative,

    //pure: applicative.of,

    flatMap: (f, fa) => fa.flatMap(f),
  })

export const kleisli = <E, A, B>(f: (a: A) => Task<B>) => {
  return Kleisli.of<[URI<TaskURI>], {}, never, never, E, A, B>(monad(), f)
}
