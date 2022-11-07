import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import isJsonValue, { Warning, Reason } from 'is-json-value'

const warnings = isJsonValue(true)
expectType<Warning[]>(warnings)
expectError(isJsonValue())
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
