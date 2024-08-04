[![Node](https://img.shields.io/badge/-Node.js-808080?logo=node.js&colorA=404040&logoColor=66cc33)](https://www.npmjs.com/package/is-json-value)
[![Browsers](https://img.shields.io/badge/-Browsers-808080?logo=firefox&colorA=404040)](https://unpkg.com/is-json-value?module)
[![TypeScript](https://img.shields.io/badge/-Typed-808080?logo=typescript&colorA=404040&logoColor=0096ff)](/src/main.d.ts)
[![Codecov](https://img.shields.io/badge/-Tested%20100%25-808080?logo=codecov&colorA=404040)](https://codecov.io/gh/ehmicky/is-json-value)
[![Minified size](https://img.shields.io/bundlephobia/minzip/is-json-value?label&colorA=404040&colorB=808080&logo=webpack)](https://bundlephobia.com/package/is-json-value)
[![Mastodon](https://img.shields.io/badge/-Mastodon-808080.svg?logo=mastodon&colorA=404040&logoColor=9590F9)](https://fosstodon.org/@ehmicky)
[![Medium](https://img.shields.io/badge/-Medium-808080.svg?logo=medium&colorA=404040)](https://medium.com/@ehmicky)

Check if a value is valid JSON.

# Hire me

Please
[reach out](https://www.linkedin.com/feed/update/urn:li:activity:7117265228068716545/)
if you're looking for a Node.js API or CLI engineer (11 years of experience).
Most recently I have been [Netlify Build](https://github.com/netlify/build)'s
and [Netlify Plugins](https://www.netlify.com/products/build/plugins/)'
technical lead for 2.5 years. I am available for full-time remote positions.

# Features

- Detects [many types](#warnings) of invalid values with JSON
- Returns [warning messages](#message) to throw or log
- Returns invalid properties' [path](#path) and [value](#value)

# Example

<!-- eslint-disable symbol-description, fp/no-mutation -->

```js
import isJsonValue from 'is-json-value'

const input = { one: true, two: { three: Symbol() } }
input.self = input

// Throws due to cycle with 'self'.
// Also, 'two.three' would be omitted since it has an invalid JSON type.
JSON.stringify(input)

const warnings = isJsonValue(input)
const isValidJson = warnings.length === 0 // false
console.log(warnings)
// [
//   {
//     message: 'Property "two.three" must not be a symbol.',
//     path: ['two', 'three'],
//     value: Symbol(),
//     reason: 'ignoredSymbolValue'
//   },
//   {
//     message: 'Property "self" must not be a circular value.',
//     path: ['self'],
//     value: <ref *1> { one: true, two: [Object], self: [Circular *1] },
//     reason: 'unsafeCycle'
//   }
// ]

if (!isValidJson) {
  // Error: Property "two.three" must not be a symbol.
  throw new Error(warnings[0].message)
}
```

# Install

```bash
npm install is-json-value
```

This package works in both Node.js >=18.20.0 and
[browsers](https://raw.githubusercontent.com/ehmicky/dev-tasks/main/src/browserslist).

This is an ES module. It must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`. If TypeScript is used, it must be configured to
[output ES modules](https://www.typescriptlang.org/docs/handbook/esm-node.html),
not CommonJS.

# API

## isJsonValue(input)

`input` `any`\
_Return value_: [`Warning[]`](#warning)

Returns an array of [warnings](#warning). If `input` is valid to serialize as
JSON, that array is empty.

### Warning

Each warning is an object indicating that a specific property is invalid to
serialize as JSON. The same property might have multiple warnings.

#### message

_Type_: `string`

Warning message, like `'Property "example" must not be a symbol.'`

#### path

_Type_: `Array<string | symbol | number>`

Path to the invalid property. Empty array if this is the top-level value.

#### value

_Type_: `unknown`

Value of the invalid property.

#### reason

_Type_: `string`

Reason for the warning among:

- [Invalid type](#invalid-types): [`"ignoredFunction"`](#functions),
  [`"ignoredUndefined"`](#undefined), [`"ignoredSymbolValue"`](#symbol-values),
  [`"ignoredSymbolKey"`](#symbol-keys),
  [`"unstableInfinite"`](#nan-and-infinity), [`"unresolvedClass"`](#classes),
  [`"ignoredNotEnumerable"`](#non-enumerable-keys),
  [`"ignoredArrayProperty"`](#array-properties)
- [Throws an exception](#exceptions): [`"unsafeCycle"`](#cycles),
  [`"unsafeBigInt"`](#bigint), [`"unsafeSize"`](#big-properties),
  [`"unsafeException"`](#infinite-recursion),
  [`"unsafeToJSON"`](#exceptions-in-tojson),
  [`"unsafeGetter"`](#exceptions-in-getters)

# Warnings

This is the list of possible warnings.

## Invalid types

JSON only supports booleans, numbers, strings, arrays, objects and `null`. Any
other type is omitted or transformed by `JSON.stringify()`.

### Functions

```js
const invalidJson = { prop: () => {} }
JSON.stringify(invalidJson) // '{}'
```

### Undefined

```js
const invalidJson = { prop: undefined }
JSON.stringify(invalidJson) // '{}'
```

### Symbol values

<!-- eslint-disable symbol-description -->

```js
const invalidJson = { prop: Symbol() }
JSON.stringify(invalidJson) // '{}'
```

### Symbol keys

<!-- eslint-disable symbol-description -->

```js
const invalidJson = { [Symbol()]: true }
JSON.stringify(invalidJson) // '{}'
```

### NaN and Infinity

```js
const invalidJson = { one: Number.NaN, two: Number.POSITIVE_INFINITY }
JSON.stringify(invalidJson) // '{"one":null,"two":null}'
```

### Classes

```js
const invalidJson = { prop: new Set([]) }
JSON.stringify(invalidJson) // '{"prop":{}}'
```

### Non-enumerable keys

<!-- eslint-disable fp/no-mutating-methods -->

```js
const invalidJson = {}
Object.defineProperty(invalidJson, 'prop', { value: true, enumerable: false })
JSON.stringify(invalidJson) // '{}'
```

### Array properties

<!-- eslint-disable fp/no-mutation -->

```js
const invalidJson = []
invalidJson.prop = true
JSON.stringify(invalidJson) // '[]'
```

## Exceptions

`JSON.stringify()` can throw on specific properties.

### Cycles

<!-- eslint-disable fp/no-mutation -->

```js
const invalidJson = { prop: true }
invalidJson.self = invalidJson
JSON.stringify(invalidJson) // Throws: Converting circular structure to JSON
```

### BigInt

```js
const invalidJson = { prop: 0n }
JSON.stringify(invalidJson) // Throws: Do not know how to serialize a BigInt
```

### Big properties

```js
const invalidJson = { prop: '\n'.repeat(5e8) }
JSON.stringify(invalidJson) // Throws: Invalid string length
```

### Infinite recursion

```js
const invalidJson = { toJSON: () => ({ invalidJson }) }
JSON.stringify(invalidJson) // Throws: Maximum call stack size exceeded
```

### Exceptions in `toJSON()`

```js
const invalidJson = {
  prop: {
    toJSON: () => {
      throw new Error('example')
    },
  },
}
JSON.stringify(invalidJson) // Throws: example
```

### Exceptions in getters

<!-- eslint-disable fp/no-get-set -->

```js
const invalidJson = {
  get prop() {
    throw new Error('example')
  },
}
JSON.stringify(invalidJson) // Throws: example
```

### Exceptions in proxies

<!-- eslint-disable fp/no-proxy -->

```js
const invalidJson = new Proxy(
  { prop: true },
  {
    get: () => {
      throw new Error('example')
    },
  },
)
JSON.stringify(invalidJson) // Throws: example
```

# Related projects

- [`safe-json-value`](https://github.com/ehmicky/safe-json-value): ⛑️ JSON
  serialization should never fail
- [`truncate-json`](https://github.com/ehmicky/truncate-json): Truncate a JSON
  string
- [`guess-json-indent`](https://github.com/ehmicky/guess-json-indent): Guess the
  indentation of a JSON string

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<!--
<table><tr><td align="center"><a href="https://fosstodon.org/@ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/is-json-value/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/is-json-value/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>
 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
