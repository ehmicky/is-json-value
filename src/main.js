import safeJsonValue from 'safe-json-value'

// We do not pass the `maxSize` option:
//  - It is better for users to use `JSON.stringify(value).length` or
//    `truncate-json` instead
//  - We still keep the default value to prevent exceptions due to large values
export default function isJsonValue(value) {
  return safeJsonValue(value).changes.filter(isJsonError).map(getJsonError)
}

// Some normalizations performed by `safe-json-value` should not be used for
// validation purpose
const isJsonError = function ({ reason }) {
  return !VALID_REASONS.has(reason)
}

const VALID_REASONS = new Set([
  'descriptorNotConfigurable',
  'descriptorNotWritable',
  'unresolvedGetter',
  'unresolvedToJSON',
])

const getJsonError = function ({ path, oldValue: value, reason, error }) {
  const message = getMessage(path, reason, error)
  return { message, path, value, reason }
}

// We do not provide with a concatenated version of all errors messages, letting
// the user instead chose whether to show `errors[0].message`,
// `errors.slice(number).map(getMessage)` or `errors.map(getMessage)`.
const getMessage = function (path, reason, error) {
  const prefix = getPrefix(path)
  const description = getDescription(reason)
  const errorStack = getErrorStack(error)
  return `${prefix}${description}${errorStack}`
}

const getPrefix = function (path) {
  return path.length === 0 ? '' : `${serializePath(path)} property `
}

// We do not quote the variable name so that user can easily prefix it
const serializePath = function (path) {
  return path.map(serializeKey).join('')
}

const serializeKey = function (key, index) {
  const type = typeof key
  return type === 'number' || type === 'symbol'
    ? `[${key}]`
    : serializeStringKey(key, index)
}

const serializeStringKey = function (key, index) {
  if (key === '') {
    return '[""]'
  }

  if (!JS_VAR_NAME_REGEXP.test(key)) {
    return `[${JSON.stringify(key)}]`
  }

  return index === 0 ? key : `.${key}`
}

// Valid variable name in JavaScript.
// Does not include zero-width spaces since those are invisible.
const JS_VAR_NAME_REGEXP = /[\p{ID_Start}$_][\p{ID_Continue}$_]*/u

const getDescription = function (reason) {
  return `must ${DESCRIPTIONS[reason]}.`
}

const DESCRIPTIONS = {
  ignoredArrayProperty: 'not be a property on an array',
  ignoredFunction: 'not be a function',
  ignoredNotEnumerable: 'be enumerable',
  ignoredSymbolKey: 'not have a symbol key',
  ignoredSymbolValue: 'not be a symbol',
  ignoredUndefined: 'not be undefined',
  unresolvedClass: 'be a plain object',
  unsafeBigInt: 'not be a bigint',
  unsafeCycle: 'not be an infinite cycle',
  unsafeException: 'not throw an exception',
  unsafeGetter: 'not throw an exception',
  unsafeSize: 'have a smaller size',
  unsafeToJSON: 'not throw an exception in toJSON()',
  unstableInfinite: 'not be NaN nor Infinity',
}

const getErrorStack = function (error) {
  return error === undefined ? '' : `\n${error.stack}`
}
