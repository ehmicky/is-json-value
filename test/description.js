import test from 'ava'
import isJsonValue from 'is-json-value'
import { each } from 'test-each'

// eslint-disable-next-line no-restricted-imports
import { DESCRIPTIONS } from '../src/description.js'

const arrayWithProps = []
// eslint-disable-next-line fp/no-mutation
arrayWithProps.prop = true

const circularValue = {}
// eslint-disable-next-line fp/no-mutation
circularValue.self = circularValue

const hasValidDescription = function ({ message, reason }) {
  return message.endsWith(`must ${DESCRIPTIONS[reason]}.`)
}

each(
  [
    arrayWithProps,
    () => {},
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty({}, 'prop', { value: true, enumerable: false }),
    { [Symbol('test')]: true },
    Symbol('test'),
    undefined,
    new Set([]),
    // eslint-disable-next-line no-magic-numbers
    0n,
    circularValue,
  ],
  ({ title }, input) => {
    test(`Return description | ${title}`, (t) => {
      t.true(isJsonValue(input).every(hasValidDescription))
    })
  },
)
