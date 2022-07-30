import { expectType, expectAssignable } from 'tsd'

import isJsonValue, { Options } from './main.js'

expectType<object>(isJsonValue(true))

isJsonValue(true, {})
expectAssignable<Options>({})
