import test from 'ava'
import isJsonValue from 'is-json-value'
import { each } from 'test-each'

each(
  [
    { input: { [Symbol('test')]: undefined }, prefix: '[Symbol(test)]' },
    { input: [undefined], prefix: '[0]' },
    { input: { '': undefined }, prefix: '[""]' },
    { input: { '.': undefined }, prefix: '["."]' },
    { input: { 0: undefined }, prefix: '["0"]' },
    { input: { '0one': undefined }, prefix: '["0one"]' },
    { input: { '\0': undefined }, prefix: '["\\u0000"]' },
    { input: { 'one\0': undefined }, prefix: '["one\\u0000"]' },
    { input: { one: undefined }, prefix: 'one' },
    { input: { one: { two: undefined } }, prefix: 'one.two' },
    { input: { one: [undefined] }, prefix: 'one[0]' },
    { input: [{ one: undefined }], prefix: '[0].one' },
    { input: { one0: undefined }, prefix: 'one0' },
    { input: { one_: undefined }, prefix: 'one_' },
    { input: { _one: undefined }, prefix: '_one' },
    { input: { one$: undefined }, prefix: 'one$' },
    { input: { $one: undefined }, prefix: '$one' },
    // eslint-disable-next-line id-length
    { input: { a: undefined }, prefix: 'a' },
    { input: { 'one\u200C': undefined }, prefix: '["one\u200C"]' },
    { input: { 'one\u00E1': undefined }, prefix: 'one\u00E1' },
  ],
  ({ title }, { input, prefix }) => {
    test(`Serialize path | ${title}`, (t) => {
      const [{ message }] = isJsonValue(input)
      t.true(message.startsWith(`Property "${prefix}" `))
    })
  },
)

test('Serialize top-level path', (t) => {
  const [{ message }] = isJsonValue()
  t.is(message, 'It must not be undefined.')
})
