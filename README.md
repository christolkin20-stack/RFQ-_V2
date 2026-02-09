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
- For simplicity the API is CSRF-exempt in this package. If you want CSRF protection, tell me and I’ll switch the JS to send CSRF token.
