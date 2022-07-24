import test from 'ava'
import isJsonValue from 'is-json-value'
import safeJsonValue from 'safe-json-value'
import { each } from 'test-each'

each(
  [
    {
      // eslint-disable-next-line fp/no-mutating-methods
      input: Object.defineProperty({}, 'prop', {
        value: true,
        enumerable: true,
        writable: false,
        configurable: true,
      }),
      reason: 'descriptorNotWritable',
    },
    {
      // eslint-disable-next-line fp/no-mutating-methods
      input: Object.defineProperty({}, 'prop', {
        value: true,
        enumerable: true,
        writable: true,
        configurable: false,
      }),
      reason: 'descriptorNotConfigurable',
    },
    {
      input: {
        // eslint-disable-next-line fp/no-get-set
        get prop() {
          return true
        },
      },
      reason: 'unresolvedGetter',
    },
    {
      input: {
        toJSON() {
          return {}
        },
      },
      reason: 'unresolvedToJSON',
    },
  ],
  ({ title }, { input, reason: expectedReason }) => {
    test(`Ignores some reasons | ${title}`, (t) => {
      t.is(isJsonValue(input).length, 0)
      t.true(
        safeJsonValue(input).changes.some(
          // eslint-disable-next-line max-nested-callbacks
          ({ reason }) => reason === expectedReason,
        ),
      )
    })
  },
)
