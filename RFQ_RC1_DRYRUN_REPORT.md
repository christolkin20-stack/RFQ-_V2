# RFQ RC1 Dry-run Report

Date: 2026-02-15

## Scope executed
- Preflight (`scripts/preflight.sh`)
- Quote planner -> export-to-item roundtrip test
- RC1 dryrun scenario: 2 suppliers / 10 items / submit+approve flow

## Result
✅ PASS

## Important fix found during dry-run
- Bug: Quote creation path could hit `UNIQUE constraint failed: rfq_quote.id`
- Root cause: some `Quote.objects.create(...)` paths did not set explicit `id` on a CharField PK.
- Fix applied:
  - `rfq/api_supplier.py` (supplier approval quote import path)
  - `rfq/api_quotes.py` (create_from_item and upsert_from_planner new quote path)
  - now generating unique IDs via UUID.

## Current confidence
- Security/auth baseline: green
- Supplier interaction flow: green
- Quote roundtrip flow: green
- Multi-supplier dryrun scenario: green

## Recommendation
Proceed to internal RC tag after one final smoke on target host using:
```bash
./scripts/preflight.sh
```
