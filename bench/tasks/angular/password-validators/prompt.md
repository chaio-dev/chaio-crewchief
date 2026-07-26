Write a single TypeScript file exporting two Angular-style validators.

A validator here is a function of the shape `(control: { value: any }) => null | { [key: string]: any }`. It returns `null` when valid, or an error object when invalid.

Export exactly these two:

1. `export function passwordStrength(control: { value: any }): null | { [key: string]: any }`
   - Treat `control.value` as the password string. If it is null/undefined, treat it as the empty string `''`.
   - Check these rules and collect a key for EACH failing rule into a single error object:
     - length: fails when the string length is `< 10` → key `minLength: true`
     - uppercase: fails when there is no `[A-Z]` character → key `uppercase: true`
     - lowercase: fails when there is no `[a-z]` character → key `lowercase: true`
     - digit: fails when there is no `[0-9]` character → key `digit: true`
     - symbol: fails when there is no character outside `[A-Za-z0-9]` → key `symbol: true`
   - If all rules pass, return `null`. Otherwise return an object containing ONLY the keys for the failing rules (each mapped to `true`).

2. `export function matchFields(a: string, b: string): (control: { value: any }) => null | { [key: string]: any }`
   - A factory returning a cross-field validator. The returned validator reads `control.value` as an object and compares `control.value[a]` to `control.value[b]`.
   - Return `null` when they are strictly equal (`===`), otherwise return `{ mismatch: true }`.
   - If `control.value` is null/undefined, treat both fields as `undefined` (which are strictly equal → returns `null`).

Output ONLY one ```ts code block containing the complete file.
