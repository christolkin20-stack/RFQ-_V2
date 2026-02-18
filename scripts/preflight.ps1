#Requires -Version 5.1
<#
.SYNOPSIS
    RFQ Preflight – full test suite (Windows PowerShell version)
.DESCRIPTION
    Mirrors scripts/preflight.sh for native Windows execution.
    Runs Django system check, all Python test modules, production-mode
    auth guard sanity, and frontend JS tests.
#>
$ErrorActionPreference = 'Stop'

$RootDir = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
Push-Location $RootDir

try {
    Write-Host "============================================"
    Write-Host "  RFQ Preflight – full test suite"
    Write-Host "============================================"

    # ---- 1/6 Django system check ----
    Write-Host "`n[1/6] Django system check"
    python manage.py check
    if ($LASTEXITCODE -ne 0) { throw "Django system check failed" }

    # ---- 2/6 Core tests ----
    Write-Host "`n[2/6] Core tests (smoke + auth guards + supplier flow)"
    python manage.py test `
        rfq.tests.test_api_smoke `
        rfq.tests.test_auth_guards `
        rfq.tests.test_supplier_flow `
        -v 1
    if ($LASTEXITCODE -ne 0) { throw "Core tests failed" }

    # ---- 3/6 Feature tests ----
    Write-Host "`n[3/6] Feature tests (quotes, versioning, RC1 dryrun)"
    python manage.py test `
        rfq.tests.test_quote_roundtrip `
        rfq.tests.test_project_version_conflict `
        rfq.tests.test_rc1_dryrun `
        -v 1
    if ($LASTEXITCODE -ne 0) { throw "Feature tests failed" }

    # ---- 4/6 Security & regression tests ----
    Write-Host "`n[4/6] Security & regression tests"
    python manage.py test `
        rfq.tests.test_security_hotfixes `
        rfq.tests.test_session_lock_hotfix `
        rfq.tests.test_mega_admin_access `
        rfq.tests.test_highrisk_noninteractive `
        rfq.tests.test_urgent_audit_regressions `
        -v 1
    if ($LASTEXITCODE -ne 0) { throw "Security & regression tests failed" }

    # ---- 5/6 Production-mode auth guard ----
    Write-Host "`n[5/6] Production-mode auth guard sanity"
    $env:DJANGO_DEBUG = '0'
    python manage.py test `
        rfq.tests.test_api_smoke.ApiSmokeTests.test_projects_requires_auth_in_production_mode `
        -v 1
    $prodResult = $LASTEXITCODE
    Remove-Item Env:\DJANGO_DEBUG -ErrorAction SilentlyContinue
    if ($prodResult -ne 0) { throw "Production-mode auth guard test failed" }

    # ---- 6/6 Frontend JS tests ----
    Write-Host "`n[6/6] Frontend JS tests (data layer + locking)"
    node scripts/run_js_tests.js
    if ($LASTEXITCODE -ne 0) { throw "Frontend JS tests failed" }

    Write-Host ""
    Write-Host "============================================"
    Write-Host "  ✅ Preflight PASSED – all tests green"
    Write-Host "============================================"
}
catch {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Red
    Write-Host "  ❌ Preflight FAILED: $_" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
    exit 1
}
finally {
    Pop-Location
}
