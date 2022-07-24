import safeJsonValue from 'safe-json-value'

import { isWarning, getDescription } from './description.js'
import { getPrefix } from './prefix.js'

// We do not pass the `maxSize` option:
//  - It is better for users to use `JSON.stringify(value).length` or
//    `truncate-json` instead
//  - We still keep the default value to prevent exceptions due to large values
export default function isJsonValue(input) {
  return safeJsonValue(input).changes.filter(isWarning).map(getWarning)
}

const getWarning = function ({ path, oldValue: value, reason, error }) {
  const message = getMessage(path, reason, error)
  return { message, path, value, reason }
}

// We do not provide with a concatenated version of all warning messages,
// letting the user instead chose whether to show `warnings[0].message`,
// `warnings.slice(number).map(getMessage)` or `warnings.map(getMessage)`.
const getMessage = function (path, reason, error) {
  const prefix = getPrefix(path)
  const description = getDescription(reason)
  const errorStack = getErrorStack(error)
  return `${prefix} ${description}${errorStack}`
}

const getErrorStack = function (error) {
  return error === undefined ? '' : `\n${error.stack}`
}
