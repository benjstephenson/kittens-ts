# kittens-ts

A small set of types and utilities for functional programming in Typescript that aims to be beginner friendly.
Data types are class based to make their usage usage a little more familiar, which does come with some runtime cost vs taking a function based approach.

Both method chaining on classes and functional style pipes are supported:


```typescript
const inc = (a: number) => a + 1

const maybeFoo = O.of(0)

maybeFoo.map(inc).map(inc)

pipe(
  maybeFoo,
  O.map(inc),
  O.map(inc)
)

```



## Installation

To get started:

### `npm i @benjstephenson/kittens-ts`


## Examples

Refer to `/src/examples` for a list of descriptive examples on how to use this library.
