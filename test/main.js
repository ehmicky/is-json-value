import test from 'ava'
import isJsonValue from 'is-json-value'

test('Dummy test', (t) => {
  t.is(typeof isJsonValue, 'function')
})
