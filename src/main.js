import safeJsonValue from 'safe-json-value'

import { isJsonError, getDescription } from './description.js'
import { getPrefix } from './prefix.js'

// We do not pass the `maxSize` option:
//  - It is better for users to use `JSON.stringify(value).length` or
//    `truncate-json` instead
//  - We still keep the default value to prevent exceptions due to large values
export default function isJsonValue(value) {
  return safeJsonValue(value).changes.filter(isJsonError).map(getJsonError)
}

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

const getErrorStack = function (error) {
  return error === undefined ? '' : `\n${error.stack}`
}
