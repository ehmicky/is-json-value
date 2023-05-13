import isJsonValue, { type Warning, type Reason } from 'is-json-value'
import { expectType, expectAssignable, expectNotAssignable } from 'tsd'

const warnings = isJsonValue(true)
expectType<Warning[]>(warnings)
// @ts-expect-error
isJsonValue()
isJsonValue(true)
isJsonValue(Symbol(''))
isJsonValue({})

const { message, path, value, reason } = warnings[0]!
expectType<string>(message)
expectType<PropertyKey[]>(path)
expectType<unknown>(value)
expectType<Reason>(reason)

expectAssignable<Reason>('ignoredFunction')
expectNotAssignable<Reason>('unresolvedToJSON')
expectNotAssignable<Reason>('unknown')
expectNotAssignable<Reason>(true)
