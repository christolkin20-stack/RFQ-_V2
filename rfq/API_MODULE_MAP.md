# RFQ API Module Map

## Active route modules

- `rfq/api_projects.py`
  - health, session/me, session/switch_company
  - projects CRUD + bulk/reset
  - attachments CRUD
  - project access ACL
  - edit locks (acquire/heartbeat/release/status/force_unlock)
  - admin users/companies/audit_logs/locks
  - export (auth + company scope, delegates rendering to `api_export`)

- `rfq/api_supplier.py`
  - supplier access generation (single + bulk)
  - supplier portal submit/save_draft
  - approve/reject/reopen/cancel/request_reopen/update_items/viewed
  - supplier interaction file download

- `rfq/api_quotes.py`
  - quotes list/detail/create/update/delete
  - create_from_item / export_to_item / bulk_import / upsert_from_planner

- `rfq/api_export.py`
  - `render_export(projects, payload)` — pure rendering (XLSX/PDF/CSV)
  - receives already company-scoped and ACL-checked project list
  - no auth logic — caller is responsible for access control

## Shared helpers

- `rfq/api_common.py`
  - `get_request_actor` / `require_auth_and_profile`
  - `require_role` / `can_view_project` / `can_edit_project`
  - `require_same_origin_for_unsafe`
  - `audit_log`
  - `json_body`

## Legacy

- `rfq/views_api.py`
  - No longer used by URL routing (all routes point to domain modules)
  - Kept for backward-compatible import aliases (supplier + quotes)
  - Contains legacy unscoped implementations — DO NOT call directly
