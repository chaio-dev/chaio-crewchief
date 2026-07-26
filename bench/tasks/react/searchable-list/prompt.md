Write a single TypeScript React file exporting a component `SearchableList`.

Contract:
- `export function SearchableList(props: { items: string[] }): JSX.Element`
- Render a text input followed by a list of matching items.

Behavioral requirements:
- The input must have `placeholder="Search"`. Initially the query is empty and ALL items are shown.
- Filtering is case-insensitive substring matching: an item is shown when its lowercased text contains the lowercased query. When the query is empty, every item is shown.
- Each matching item is rendered inside its own `<li>` element. The list container is a `<ul>`.
- Within each shown item, the FIRST case-insensitive occurrence of the query substring must be wrapped in a `<mark>` element, preserving the item's original casing. Text before and after the match is rendered as plain text. When the query is empty, render the item text with no `<mark>`.
- When no items match the current (non-empty) query, do NOT render the `<ul>`; instead render a single element with the exact text `No results`.

Implementation notes: use `useState` for the query. Controlled input (`value` + `onChange`). No external libraries. Use a stable React `key` on each list item (the item string is unique enough for this task).

Output ONLY one ```tsx code block containing the complete file.
