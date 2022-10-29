import type { Reason as SafeJsonValueReason } from 'safe-json-value'

/**
 * Reason why a value is invalid to serialize as JSON.
 */
export type Reason = Exclude<
  SafeJsonValueReason,
  | 'descriptorNotConfigurable'
  | 'descriptorNotWritable'
  | 'unresolvedGetter'
  | 'unresolvedToJSON'
>

/**
 * Specific property that is invalid to serialize as JSON.
 * The same property might have multiple warnings.
 */
export interface Warning {
  /**
   * Warning message, like `'Property "example" must not be a symbol.'`
   */
  message: string

  /**
   * Path to the invalid property. Empty array if this is the top-level value.
   */
  path: PropertyKey[]

  /**
   * Value of the invalid property.
   */
  value: unknown

  /**
   * Reason for the warning.
   */
  reason: Reason
}

/**
 * Check if a value is valid JSON.
 * Returns an array of warnings.
 * If `input` is valid to serialize as JSON, that array is empty.
 *
 * @example
 * ```js
 * const input = { one: true, two: { three: Symbol() } }
 * input.self = input
 *
 * // Throws due to cycle with 'self'.
 * // Also, 'two.three' would be omitted since it has an invalid JSON type.
 * JSON.stringify(input)
 *
 * const warnings = isJsonValue(input)
 * const isValidJson = warnings.length === 0 // false
 * console.log(warnings)
 * // [
 * //   {
 * //     message: 'Property "two.three" must not be a symbol.',
 * //     path: ['two', 'three'],
 * //     value: Symbol(),
 * //     reason: 'ignoredSymbolValue'
 * //   },
 * //   {
 * //     message: 'Property "self" must not be a circular value.',
 * //     path: ['self'],
 * //     value: <ref *1> { one: true, two: [Object], self: [Circular *1] },
 * //     reason: 'unsafeCycle'
 * //   }
 * // ]
 *
 * if (!isValidJson) {
 *   // Error: Property "two.three" must not be a symbol.
 *   throw new Error(warnings[0].message)
 * }
 * ```
 */
export default function isJsonValue(input: any): Warning[]
