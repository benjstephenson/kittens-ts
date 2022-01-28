type PartialTuple<Tupled extends any[], Values extends any[] = []> =
  // If the tuple provided has at least one required value
  Tupled extends [infer Next, ...infer Remaining]
    ? // recurse back in to this type with one less item
      // in the original tuple, and the latest extracted value
      // added to the extracted list as optional
      PartialTuple<Remaining, [...Values, Next?]>
    : // else if there are no more values,
      // return an empty tuple so that too is a valid option
      [...Values, ...Tupled]

type PartialParams<Func extends (...args: any[]) => any> = PartialTuple<Parameters<Func>>

type RemainingParams<Params extends any[], RequiredParams extends any[]> =
  // if the expected array has any required items…
  RequiredParams extends [infer RequiredParam, ...infer OtherRequiredParams]
    ? // if the provided array has at least one required item,
      // recurse with one item less in each array type
      Params extends [infer Param, ...infer OtherParams]
      ? Param extends RequiredParam
        ? RemainingParams<OtherParams, OtherRequiredParams>
        : never
      : // else the remaining args is unchanged
        RequiredParams
    : // else there are no more arguments
      []

type CurriedFunction<SuppliedParams extends any[], Fun extends (...args: any[]) => any> = <
  MoreArgs extends PartialTuple<RemainingParams<SuppliedParams, Parameters<Fun>>>
>(
  ...args: MoreArgs
) => CurriedOrValue<[...SuppliedParams, ...MoreArgs], Fun>

type CurriedOrValue<SuppliedParams extends any[], Fun extends (...args: any[]) => any> = RemainingParams<
  SuppliedParams,
  Parameters<Fun>
> extends [any, ...any[]]
  ? CurriedFunction<SuppliedParams, Fun>
  : ReturnType<Fun>

export function curry<Fun extends (...param: any[]) => any, InitialParams extends PartialParams<Fun>>(
  fnToCurry: Fun,
  ...initialParams: InitialParams
): CurriedFunction<InitialParams, Fun> {
  return (...params) => {
    const totalParams = [...initialParams, ...params]

    return totalParams.length >= fnToCurry.length
      ? fnToCurry(...totalParams)
      : curry(fnToCurry, ...(totalParams as PartialParams<Fun>))
  }
}
