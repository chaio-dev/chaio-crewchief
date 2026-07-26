from solution import parse_transactions

text = 'date,merchant,amount,currency\n2026-01-15,"Amazon, Inc",1234.50,USD\n2026-02-01,Netflix,(15.99),USD\n\n2026-03-10, Starbucks ,-4.25,USD\nbad-date,Shop,10.00,USD\n2026-04-01,,10.00,USD\n2026-05-01,Shop,10.00,usd\n2026-06-01,Shop,"1,050.00",EUR\n2026-13-01,Shop,10.00,USD\n'
rows = parse_transactions(text)
assert len(rows) == 4, rows
assert rows[0] == {"date": "2026-01-15", "merchant": "Amazon, Inc", "amount": 1234.50, "currency": "USD"}
assert rows[1]["amount"] == -15.99
assert rows[2]["merchant"] == "Starbucks" and rows[2]["amount"] == -4.25
assert rows[3] == {"date": "2026-06-01", "merchant": "Shop", "amount": 1050.0, "currency": "EUR"}

# CRLF + header required
assert parse_transactions("date,merchant,amount,currency\r\n2026-01-01,A,1.00,GBP\r\n")[0]["currency"] == "GBP"
try:
    parse_transactions("merchant,amount\nA,1")
    assert False, "expected ValueError"
except ValueError:
    pass
print("ok")
