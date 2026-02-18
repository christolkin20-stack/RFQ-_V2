#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "============================================"
echo "  RFQ Preflight – full test suite"
echo "============================================"

echo ""
echo "[1/6] Django system check"
python3 manage.py check

echo ""
echo "[2/6] Core tests (smoke + auth guards + supplier flow)"
python3 manage.py test \
    rfq.tests.test_api_smoke \
    rfq.tests.test_auth_guards \
    rfq.tests.test_supplier_flow \
    -v 1

echo ""
echo "[3/6] Feature tests (quotes, versioning, RC1 dryrun)"
python3 manage.py test \
    rfq.tests.test_quote_roundtrip \
    rfq.tests.test_project_version_conflict \
    rfq.tests.test_rc1_dryrun \
    -v 1

echo ""
echo "[4/6] Security & regression tests"
python3 manage.py test \
    rfq.tests.test_security_hotfixes \
    rfq.tests.test_session_lock_hotfix \
    rfq.tests.test_mega_admin_access \
    rfq.tests.test_highrisk_noninteractive \
    rfq.tests.test_urgent_audit_regressions \
    -v 1

echo ""
echo "[5/6] Production-mode auth guard sanity"
DJANGO_DEBUG=0 python3 manage.py test \
    rfq.tests.test_api_smoke.ApiSmokeTests.test_projects_requires_auth_in_production_mode \
    -v 1

echo ""
echo "[6/6] Frontend JS tests (data layer + locking)"
node scripts/run_js_tests.js

echo ""
echo "============================================"
echo "  ✅ Preflight PASSED – all tests green"
echo "============================================"
