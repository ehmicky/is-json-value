import test from 'ava'
import isJsonValue from 'is-json-value'
import { each } from 'test-each'

each(
  [{ input: { [Symbol('test')]: undefined }, prefix: '[Symbol(test)]' }],
  ({ title }, { input, prefix }) => {
    test(`Serialize path | ${title}`, (t) => {
      const [{ message }] = isJsonValue(input)
      t.true(message.startsWith(`${prefix} property`))
    })
  },
)
