import test from 'ava'
import { each } from 'test-each'

import isJsonValue from 'is-json-value'

const symbol = Symbol('test')
each(
  [
    { input: { [symbol]: undefined }, path: [symbol] },
    { input: [undefined], path: [0] },
    { input: { '': undefined }, path: [''] },
    { input: { 0: undefined }, path: ['0'] },
    { input: { one: { two: undefined } }, path: ['one', 'two'] },
    { input: { one: [undefined] }, path: ['one', 0] },
    { input: [{ one: undefined }], path: [0, 'one'] },
  ],
  ({ title }, { input, path: expectedPath }) => {
    test(`Return path array | ${title}`, (t) => {
      const [{ path }] = isJsonValue(input)
      t.deepEqual(path, expectedPath)
    })
  },
)

each(
  [
    { input: symbol, value: symbol },
    { input: { prop: symbol }, value: symbol },
    { input: [symbol], value: symbol },
  ],
  ({ title }, { input, value: expectedValue }) => {
    test(`Return the invalid value | ${title}`, (t) => {
      const [{ value }] = isJsonValue(input)
      t.is(value, expectedValue)
    })
  },
)
