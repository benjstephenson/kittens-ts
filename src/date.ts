import { Eq, getInstance } from './hkt'

export const eq: Eq<Date> = getInstance({
  equals: (a, b) => a.valueOf() === b.valueOf(),
})

export const eqYear: Eq<Date> = getInstance({
  equals: (a, b) => a.getFullYear() === b.getFullYear(),
})

export const eqMonth: Eq<Date> = getInstance({
  equals: (a, b) => a.getMonth() === b.getMonth(),
})

export const eqDay: Eq<Date> = getInstance({
  equals: (a, b) => a.getDay() === b.getDay(),
})

export const eqTime: Eq<Date> = getInstance({
  equals: (a, b) => a.getTime() === b.getTime(),
})

export const eqYearUTC: Eq<Date> = getInstance({
  equals: (a, b) => a.getUTCFullYear() === b.getUTCFullYear(),
})

export const eqMonthUTC: Eq<Date> = getInstance({
  equals: (a, b) => a.getUTCMonth() === b.getUTCMonth(),
})

export const eqDayUTC: Eq<Date> = getInstance({
  equals: (a, b) => a.getUTCDay() === b.getUTCDay(),
})

export const eqTimeUTC: Eq<Date> = getInstance({
  equals: (a, b) => a.getUTCMilliseconds() === b.getUTCMilliseconds(),
})
