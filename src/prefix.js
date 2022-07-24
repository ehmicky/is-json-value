// Retrieve property path as a string
export const getPrefix = function (path) {
  return path.length === 0 ? '' : `${serializePath(path)} property `
}

// We do not quote the variable name so that user can easily prefix it
const serializePath = function (path) {
  return path.map(serializeKey).join('')
}

const serializeKey = function (key, index) {
  const type = typeof key
  return type === 'number' || type === 'symbol'
    ? `[${String(key)}]`
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
