export const getInstance = <T>(o: Omit<T, `_${any}`>): T => {
  return o as any
}
