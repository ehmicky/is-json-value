import type { Reason as SafeJsonValueReason } from 'safe-json-value'

/**
 *
 */
export type Reason = Exclude<
  SafeJsonValueReason,
  | 'descriptorNotConfigurable'
  | 'descriptorNotWritable'
  | 'unresolvedGetter'
  | 'unresolvedToJSON'
>

/**
 *
 */
export interface Warning {
  /**
   *
   */
  message: string

  /**
   *
   */
  path: PropertyKey[]

  /**
   *
   */
  value: unknown

  /**
   *
   */
  reason: Reason
}

/**
 *
 * @example
 * ```js
 * ```
 */
export default function isJsonValue(input: any): Warning[]
