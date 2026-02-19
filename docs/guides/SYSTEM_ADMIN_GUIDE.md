# System Admin Guide

Průvodce nasazením, konfigurací a údržbou RFQ systému.

---

## 1) Požadavky

- **Python** 3.10+
- **pip** (správce balíčků)
- **Databáze:** SQLite (dev) nebo PostgreSQL / Supabase (prod)
- **Node.js** 18+ (volitelné, pro JS testy)
- **OS:** Linux, macOS, Windows (WSL doporučeno pro skripty)

---

## 2) Instalace

```bash
git clone https://github.com/christolkin20-stack/RFQ-_V2.git
cd RFQ-_V2
python3 -m venv .venv
source .venv/bin/activate        # Linux/Mac
# .venv\Scripts\activate         # Windows
pip install -r requirements.txt
```

---

## 3) Konfigurace .env

Vytvořte `.env` z `.env.example`:

```bash
cp .env.example .env
```

### Povinné proměnné

| Proměnná | Popis | Příklad |
|----------|-------|---------|
| `DJANGO_SECRET_KEY` | Tajný klíč (min. 50 znaků) | `django-insecure-abc123...` |
| `DJANGO_DEBUG` | Debug režim (0 v produkci!) | `0` |
| `DJANGO_ALLOWED_HOSTS` | Povolené domény | `example.com,127.0.0.1,localhost` |

### Volitelné proměnné

| Proměnná | Popis | Default |
|----------|-------|---------|
| `DATABASE_URL` | PostgreSQL/Supabase connection string | SQLite (`db.sqlite3`) |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | CSRF trusted origins | — |

### Supabase připojení
```
DATABASE_URL=postgresql://postgres.xxx:heslo@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

---

## 4) Databáze

```bash
python manage.py migrate          # Vytvoří/aktualizuje tabulky
python manage.py createsuperuser   # Vytvoří admin účet
python seed_data.py                # (volitelné) Naplní testovacími daty
```

### Kontrola migrace
```bash
python manage.py showmigrations   # Zobrazí stav migrací
python manage.py migrate --check  # Ověří, zda jsou aplikovány všechny migrace
```

---

## 5) Spuštění

### Development
```bash
python manage.py runserver 0.0.0.0:8000
```

### Produkce (Gunicorn)
```bash
gunicorn rfq_django.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

Doporučujeme reverse proxy (Nginx/Caddy) s HTTPS.

---

## 6) Preflight testy

Před každým deploym spusťte preflight:

### Linux/Mac
```bash
bash scripts/preflight.sh
```

### Windows (PowerShell)
```powershell
.\scripts\preflight.ps1
```

### Co preflight testuje
- Django system check
- Všech **11 Python test modulů** (45 testů celkem)
- Production-mode auth guard sanity check
- **5 JS frontend testů**

Pokud preflight projde bez chyb, deploy je bezpečný.

---

## 7) Bezpečnost

### CSRF ochrana
Všechny POST/PUT/DELETE requesty vyžadují CSRF token. API endpointy používají `@csrf_exempt` s vlastní auth logikou.

### Company isolation
Uživatel vidí jen data své firmy. Implementováno na úrovni DB queryset filtrů v `api_common.py`.

### Role-based access
4 role (viewer → editor → admin → superadmin) s rostoucími oprávněními. Kontrola přes `require_role()` helper.

### Edit Locks
Optimistické zamykání s 3-min TTL. Heartbeat obnovuje lock. Prevence ztráty dat při souběžné editaci.

---

## 8) Záloha a obnova

### SQLite
```bash
cp db.sqlite3 db.sqlite3.backup.$(date +%Y%m%d)
```

### PostgreSQL / Supabase
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Media soubory
```bash
tar czf media_backup_$(date +%Y%m%d).tar.gz media/
```

### Export projektů přes API
```bash
curl -b cookies.txt https://example.com/api/projects/export/ > projects_export.json
```

---

## 9) Troubleshooting

### CSRF token missing
- Ověřte `DJANGO_CSRF_TRUSTED_ORIGINS` v `.env`
- Prohlížeč musí posílat cookies (same-origin)

### Migrace selhala
```bash
python manage.py showmigrations    # Zkontrolujte stav
python manage.py migrate --fake    # Jen pokud víte co děláte!
```

### Lock stuck (zamčený záznam)
1. Otevřete Mega Admin → Active Locks
2. Force unlock příslušný záznam
3. Nebo počkejte 3 minuty na automatickou expiraci

### Supplier portál neukazuje data
- Zkontrolujte platnost tokenu v DB (`SupplierAccess` model)
- Ověřte, že projekt existuje a má položky
- Zkontrolujte `is_active` flag na SupplierAccess záznamu

### Blank page po přihlášení
- Zkontrolujte `DJANGO_ALLOWED_HOSTS`
- Ověřte, že static files jsou dostupné (`python manage.py collectstatic`)
- Zkontrolujte JS konzoli prohlížeče pro chyby

### Pomalý výkon
- Ověřte, že `DJANGO_DEBUG=0` v produkci
- Zvažte PostgreSQL místo SQLite pro > 10 souběžných uživatelů
- Monitorujte aktivní locky — příliš mnoho může zpomalit
