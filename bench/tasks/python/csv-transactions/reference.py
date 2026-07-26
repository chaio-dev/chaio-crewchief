import csv, io, re

def parse_transactions(text):
    lines = [l for l in text.splitlines() if l.strip()]
    if not lines or lines[0].strip() != "date,merchant,amount,currency":
        raise ValueError("missing or bad header")
    out = []
    for row in csv.reader(io.StringIO("\n".join(lines[1:]))):
        if len(row) != 4:
            continue
        date, merchant, amount_s, currency = row
        if not re.fullmatch(r"\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])", date.strip()):
            continue
        merchant = merchant.strip()
        if not merchant:
            continue
        a = amount_s.strip().replace(",", "")
        neg = False
        if a.startswith("(") and a.endswith(")"):
            neg, a = True, a[1:-1]
        try:
            amount = float(a)
        except ValueError:
            continue
        if neg:
            amount = -amount
        currency = currency.strip()
        if not re.fullmatch(r"[A-Z]{3}", currency):
            continue
        out.append({"date": date.strip(), "merchant": merchant, "amount": amount, "currency": currency})
    return out
