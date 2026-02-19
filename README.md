# RFQ System – Django port

This is a Django backend + the existing RFQ single-page app (HTML/JS/CSS) served as Django static files.

## What changed
- Projects are stored on the server in SQLite via Django model `rfq.Project`.
- The browser still uses LocalStorage as a fast/offline cache, but **auto-syncs** to the server.
- Import/Export (JSON backup) still works (because it operates on LocalStorage).

## Quick start
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

python manage.py migrate
python manage.py createsuperuser  # optional
python manage.py runserver
```

Open:
- App: http://127.0.0.1:8000/
- Admin: http://127.0.0.1:8000/admin/

## API
- `GET /api/projects` -> `{projects:[...]}`
- `POST /api/projects` -> upsert single project
- `PUT /api/projects/<id>` -> upsert single project
- `POST /api/projects/bulk` -> upsert many
- `POST /api/projects/reset` -> delete all server projects

## Notes
- CSRF protection is enabled. API endpoints use session-based auth with CSRF tokens.

## Documentation
- [Buyer Guide](docs/guides/BUYER_GUIDE.md) — Creating RFQs, managing items, price comparison
- [Manager / Admin Guide](docs/guides/MANAGER_ADMIN_GUIDE.md) — Users, roles, companies, audit
- [Supplier Guide](docs/guides/SUPPLIER_GUIDE.md) — Portal access, submitting quotes
- [System Admin Guide](docs/guides/SYSTEM_ADMIN_GUIDE.md) — Deployment, backup, security
- [FAQ](docs/FAQ.md) — Common questions and troubleshooting
- [User Guide: Quoting Flow](USER_GUIDE_RFQ_QUOTING_FLOW.md) — Step-by-step quoting process
- [Runbook](RUNBOOK.md) — Quick setup and smoke tests
