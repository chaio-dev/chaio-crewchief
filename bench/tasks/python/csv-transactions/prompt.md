Write a single Python file defining a function `parse_transactions(text: str) -> list[dict]`.

Input: CSV text with header row exactly `date,merchant,amount,currency`. Fields may be quoted with double quotes; quoted fields may contain commas. Lines may be separated by \n or \r\n. Blank lines are skipped.

Each valid data row becomes `{"date": str, "merchant": str, "amount": float, "currency": str}`:
- `date` must match YYYY-MM-DD (digits and dashes in exactly that shape; no calendar validation beyond month 01-12 and day 01-31).
- `merchant` is stripped of surrounding whitespace; must be non-empty after stripping.
- `amount` may have an optional leading `-`, and may be wrapped in parentheses like `(12.50)` meaning negative 12.50. It may contain commas as thousands separators, which must be removed. Invalid numbers make the row invalid.
- `currency` must be exactly 3 uppercase ASCII letters.

Invalid rows (wrong field count, bad date, empty merchant, bad amount, bad currency) are silently skipped. The header row must be present as the first non-blank line; if the header is missing or wrong, raise `ValueError`.

Rules: standard library only (the `csv` module is allowed). Output ONLY one ```python code block.
