import { Either } from "./Either";
import { Monad, Type, URIS } from "./hkt";
import { eitherK } from "./instances/either";


export class Kleisli<F extends URIS, S, R, E, A, B> {

  constructor(
    private readonly m: Monad<F>,
    private readonly run: (a: A) => Type<F, {}, S, R, E, B>) { }


  andThen<BB>(k: Kleisli<F, S, R, E, B, BB>) {
    return new Kleisli(
      this.m,
      (a: A) => this.m.flatMap(k.run, this.run(a))
    )
  }

  apply(a: A): Type<F, {}, S, R, E, B> {
    return this.run(a)
  }


}

const a = eitherK.of((a: number): Either<string, number> => a < 1 ? Either.left<string, number>("oops") : Either.right<string, number>(a))
const b = eitherK.of((a: number): Either<string, string> => a < 1 ? Either.left("oops") : Either.right(a.toString()))

a.andThen(b).apply(1)
