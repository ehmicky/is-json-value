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

const unsafeInput = { toJSON: () => ({ unsafeInput }) }

each(
  [
    { input: arrayWithProps, reason: 'ignoredArrayProperty' },
    { input: () => {}, reason: 'ignoredFunction' },
    {
      // eslint-disable-next-line fp/no-mutating-methods
      input: Object.defineProperty({}, 'prop', {
        value: true,
        enumerable: false,
      }),
      reason: 'ignoredNotEnumerable',
    },
    { input: { [Symbol('test')]: true }, reason: 'ignoredSymbolKey' },
    { input: Symbol('test'), reason: 'ignoredSymbolValue' },
    { input: undefined, reason: 'ignoredUndefined' },
    { input: new Set([]), reason: 'unresolvedClass' },
    { input: 0n, reason: 'unsafeBigInt' },
    { input: circularValue, reason: 'unsafeCycle' },
    { input: unsafeInput, reason: 'unsafeException', hasError: true },
    {
      input: {
        // eslint-disable-next-line fp/no-get-set
        get prop() {
          throw new Error('test')
        },
      },
      reason: 'unsafeGetter',
      hasError: true,
      title: 'unsafeGetter',
    },
    // eslint-disable-next-line no-magic-numbers
    { input: 'a'.repeat(2e7), reason: 'unsafeSize' },
    {
      input: {
        toJSON() {
          throw new Error('test')
        },
      },
      reason: 'unsafeToJSON',
      hasError: true,
      title: 'unsafeToJSON',
    },
    { input: Number.NaN, reason: 'unstableInfinite' },
  ],
  ({ title }, { input, reason: expectedReason, hasError = false }) => {
    test(`Return description | ${title}`, (t) => {
      const warnings = isJsonValue(input)
      const { message } = warnings.find(
        // eslint-disable-next-line max-nested-callbacks
        ({ reason }) => reason === expectedReason,
      )
      t.true(message.includes(`must ${DESCRIPTIONS[expectedReason]}.`))
      t.is(hasError, message.includes(' at '))
    })
  },
)