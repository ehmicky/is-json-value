// Some normalizations performed by `safe-json-value` should not be used for
// validation purpose
export const isJsonError = function ({ reason }) {
  return !VALID_REASONS.has(reason)
}

const VALID_REASONS = new Set([
  'descriptorNotConfigurable',
  'descriptorNotWritable',
  'unresolvedGetter',
  'unresolvedToJSON',
])

// Retrieve a reason-specific description string
export const getDescription = function (reason) {
  return `must ${DESCRIPTIONS[reason]}.`
}

export const DESCRIPTIONS = {
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
