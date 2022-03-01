import * as A from '../Array'
import * as Eq from '@benjstephenson/kittens-ts-core/dist/src/Equal'
import * as Ord from '@benjstephenson/kittens-ts-core/dist/src/Orderable'
import * as M from '@benjstephenson/kittens-ts-core/dist/src/Monoid'

/*
  Deriving equality for ADTs
 */

interface Cat {
  name: string
  lives: number
  isGrumpy: boolean
}

const cat1: Cat = { name: 'Mittens', lives: 8, isGrumpy: false }
const cat2: Cat = { name: 'Mittens    ', lives: 6, isGrumpy: true }

// For records, if we can say what it means for each field to be equal, then we can derive an equality for the whole record
const catEqualityStrict = Eq.record<Cat>({
  name: Eq.string,
  lives: Eq.number,
  isGrumpy: Eq.boolean
})

catEqualityStrict.equals(cat1, cat2)

// Or we might want to use some more specific rules
const ignoreWhitespace: Eq.Equal<string> = Eq.from((x, y) => x.trim() === y.trim())
const fuzzyLives: Eq.Equal<number> = Eq.from((x, y) => x + 2 === y || x - 2 === y)
const maybeGrumpy = Eq.from((x: boolean, y: boolean) => x || y)

const fuzzyCatEquality = Eq.record<Cat>({
  name: ignoreWhitespace,
  lives: fuzzyLives,
  isGrumpy: maybeGrumpy
})

fuzzyCatEquality.equals(cat1, cat2)

/*
 * Sometimes we might have two related types but only know an equality check for one of them.
 * If we know how to convert from one type to another, then we can derive an equality for it too!
 *  We call this association a *contramap*
 */

// let's use JS Date, as it's awful to deal with usually.  A JS Date is really just an epoch value.
const date1 = new Date()
const date2 = new Date(new Date().setMonth(2))

// Epochs are just big numbers, and we already know how to check numbers against eachother, so lets get the epoch values and compare those.
const dateEquality = Eq.contramap((x: Date) => x.valueOf(), Eq.number)

dateEquality.equals(date1, date2)

/*
 * Deriving Ordering
 */

// Similar concept, if we know how to order a field then we can order an array of objects
const orderCatByLives: Ord.Orderable<Cat> = Ord.from((a, b) => (a.lives < b.lives ? -1 : a.lives > b.lives ? 1 : 0))
A.sort([cat1, cat2], orderCatByLives)
// this ^^^ is basically the same as the usual JS way of doing it   vvv
Array.of(cat1, cat2).sort((a, b) => (a.lives < b.lives ? -1 : a.lives > b.lives ? 1 : 0))

// we're just ordering by lives, which is a number.  Can we tidy this up with a contramap?
const orderCatByLives2 = Ord.contramap((c: Cat) => c.lives, Ord.number)
A.sort([cat1, cat2], orderCatByLives2)

// nicer, and hopefully a bit easier to read. What if we wanted to sort by more than one field at a time?
// Here we need to use something called a Monoid. We'll cover that in depth elsewhere, but for now know that it's a type that allows us to
// add together other types.

const catM = Ord.getMonoid<Cat>()
const bylives = Ord.contramap((x: Cat) => x.lives, Ord.number)
const byName = Ord.contramap((x: Cat) => x.name, Ord.string)

// we're 'adding together' the sort functions
const sortableCat = M.fold(catM)([bylives, byName])

A.sort([cat1, cat2], sortableCat)

/*
 * If we know how to order something, then that implies that we know how to compare them also -> if A is ! < B && A ! > B then A must === B
 * So we can use that fact to derive a simple equality, so Orderable also implements Equal
 */
orderCatByLives2.equals(cat1, cat2)
