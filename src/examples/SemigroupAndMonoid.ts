import * as S from '../core/Semigroup'

/*
 * A Semigroup describes how we can combine two things together.
 * Think + for numbers, [...a, ...b] for lists.
 * Essentially, for a type A, a semigroup is an f: (x: A, y: A) => A
 */

// These are all semigroups for number
1 + 1
1 * 1
1 / 1
const left = (x: number, _: number) => x
const right = (_: number, y: number) => y
const max = (x: number, y: number) => (x > y ? x : y)
const min = (x: number, y: number) => (x < y ? x : y)

// Why is this useful? Like Equality and Orderable, if we know how to combine fields of a record, then we can combine the record
interface User {
  name: string
  registeredDate: Date
  loginCount: number
}

const user1: User = { name: 'Bobby Bobson', registeredDate: new Date(), loginCount: 1 }
const user2: User = { name: 'Bobby Bobson 2', registeredDate: new Date(new Date().setMonth(2)), loginCount: 5 }

const earliestUser = S.record<User>({
  name: S.string,
  registeredDate: S.from<Date>((x, y) => (x.valueOf() < y.valueOf() ? x : y)),
  loginCount: S.sum
})

earliestUser.concat(user1, user2)
