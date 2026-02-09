import json
import logging
import os
import uuid
from decimal import Decimal, InvalidOperation
from django.http import JsonResponse, HttpResponseNotAllowed, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction

from django.conf import settings as django_settings
from .models import Project, Attachment, SupplierAccess, SupplierAccessRound, SupplierInteractionFile, Quote, QuoteLine

logger = logging.getLogger(__name__)


def _normalize_name(s):
    """Collapse whitespace and strip for robust supplier name matching."""
    return ' '.join(str(s).split()).strip()


def _require_buyer_auth(request):
    """
    Return a 401 JsonResponse if the request is not authenticated in production.
    In DEBUG mode, allow unauthenticated access (single-user / local dev).
    Returns None if access is allowed, or a JsonResponse to return early.
    """
    if request.user.is_authenticated:
        return None
    if getattr(django_settings, 'DEBUG', False):
        return None  # Allow in dev mode
    return JsonResponse({'error': 'Authentication required'}, status=401)


def _get_buyer_username(request):
    """Return the username for audit trails; falls back in DEBUG mode."""
    if request.user.is_authenticated:
        return request.user.username
    return 'admin'


def _json_body(request):
    try:
        raw = request.body.decode('utf-8') if request.body else ''
        if not raw:
            return None
        return json.loads(raw)
    except Exception as e:
        print(f"[RFQ API] JSON parse error: {e}")
        print(f"[RFQ API] Body length: {len(request.body) if request.body else 0} bytes")
        return None


def health(request):
    return JsonResponse({'ok': True})


@csrf_exempt
def projects_collection(request):
    if request.method == 'GET':
        projects = [p.as_dict() for p in Project.objects.all()]
        return JsonResponse({'projects': projects})

    if request.method == 'POST':
        payload = _json_body(request)
        if not isinstance(payload, dict):
            return JsonResponse({'error': 'Invalid JSON body'}, status=400)

        proj = payload
        pid = str(proj.get('id') or uuid.uuid4().hex)
        name = str(proj.get('name') or 'Untitled')[:255]
        with transaction.atomic():
            obj, _created = Project.objects.select_for_update().get_or_create(id=pid, defaults={'name': name, 'data': proj})
            obj.name = name
            obj.data = proj
            obj.save()
        return JsonResponse({'project': obj.as_dict()})

    return HttpResponseNotAllowed(['GET', 'POST'])


@csrf_exempt
def project_detail(request, project_id: str):
    pid = str(project_id)

    if request.method == 'GET':
        try:
            obj = Project.objects.get(id=pid)
        except Project.DoesNotExist:
            return JsonResponse({'error': 'Not found'}, status=404)
        return JsonResponse({'project': obj.as_dict()})

    if request.method in ('PUT', 'PATCH'):
        payload = _json_body(request)
        if not isinstance(payload, dict):
            return JsonResponse({'error': 'Invalid JSON body'}, status=400)
        proj = payload
        name = str(proj.get('name') or 'Untitled')[:255]
        with transaction.atomic():
            obj, _created = Project.objects.select_for_update().get_or_create(id=pid, defaults={'name': name, 'data': proj})
            obj.name = name
            obj.data = proj
            obj.save()
        return JsonResponse({'project': obj.as_dict()})

    if request.method == 'DELETE':
        Project.objects.filter(id=pid).delete()
        return JsonResponse({'ok': True})

    return HttpResponseNotAllowed(['GET', 'PUT', 'PATCH', 'DELETE'])


@csrf_exempt
def projects_bulk(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    payload = _json_body(request)
    projects = None
    if isinstance(payload, dict) and isinstance(payload.get('projects'), list):
        projects = payload.get('projects')
    elif isinstance(payload, list):
        projects = payload

    if not isinstance(projects, list):
        body_len = len(request.body) if request.body else 0
        print(f"[RFQ API] projects_bulk 400: payload type={type(payload)}, body_len={body_len}")
        return JsonResponse({'error': f'Invalid payload (expected {{projects:[...]}}), got {type(payload).__name__}, body_len={body_len}'}, status=400)

    upserted = 0
    deleted = 0
    incoming_ids = set()

    with transaction.atomic():
        # Upsert all incoming projects
        for proj in projects:
            if not isinstance(proj, dict):
                continue
            pid = str(proj.get('id') or uuid.uuid4().hex)
            incoming_ids.add(pid)
            name = str(proj.get('name') or 'Untitled')[:255]
            obj, _created = Project.objects.select_for_update().get_or_create(id=pid, defaults={'name': name, 'data': proj})
            obj.name = name
            obj.data = proj
            obj.save()
            upserted += 1

        # Delete projects not in incoming list (they were deleted locally)
        existing_ids = set(Project.objects.values_list('id', flat=True))
        ids_to_delete = existing_ids - incoming_ids
        if ids_to_delete:
            deleted = Project.objects.filter(id__in=ids_to_delete).delete()[0]

    return JsonResponse({'ok': True, 'upserted': upserted, 'deleted': deleted})


@csrf_exempt
def projects_reset(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    Project.objects.all().delete()
    return JsonResponse({'ok': True})


@csrf_exempt
def project_attachments(request, project_id: str):
    """List / upload attachments for a project."""
    try:
        proj = Project.objects.get(id=str(project_id))
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)

    if request.method == 'GET':
        atts = [a.as_dict() for a in Attachment.objects.filter(project=proj).order_by('-uploaded_at')]
        return JsonResponse({'attachments': atts})

    if request.method == 'POST':
        f = request.FILES.get('file')
        if not f:
            return JsonResponse({'error': 'Missing file'}, status=400)
        kind = str(request.POST.get('kind') or '').strip()[:32]
        att = Attachment(id=uuid.uuid4().hex, project=proj, file=f, kind=kind)
        att.save()
        return JsonResponse({'attachment': att.as_dict()})

    return HttpResponseNotAllowed(['GET', 'POST'])


@csrf_exempt
def project_attachment_detail(request, project_id: str, attachment_id: str):
    """Delete a single attachment."""
    try:
        att = Attachment.objects.get(id=str(attachment_id), project_id=str(project_id))
    except Attachment.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    if request.method == 'DELETE':
        # delete file from storage as well
        try:
            if att.file:
                att.file.delete(save=False)
        except Exception:
            pass
        att.delete()
        return JsonResponse({'ok': True})

    return HttpResponseNotAllowed(['DELETE'])


@csrf_exempt
def export_data(request):
    """Generate XLSX/PDF/CSV export based on selected options.

    Body (JSON):
      - project_ids: [..]
      - format: xlsx|pdf|csv
      - include_items, include_item_suppliers, include_price_breaks, include_rfqs, include_attachments
      - suppliers_mode: all|main
    """
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    payload = _json_body(request)
    if not isinstance(payload, dict):
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    project_ids = payload.get('project_ids') or []
    if not isinstance(project_ids, list) or not project_ids:
        return JsonResponse({'error': 'project_ids is required'}, status=400)

    fmt = str(payload.get('format') or 'xlsx').strip().lower()
    if fmt not in ('xlsx', 'pdf', 'csv'):
        fmt = 'xlsx'

    include_items = bool(payload.get('include_items', True))
    include_item_suppliers = bool(payload.get('include_item_suppliers', True))
    include_price_breaks = bool(payload.get('include_price_breaks', True))
    include_rfqs = bool(payload.get('include_rfqs', True))
    include_attachments = bool(payload.get('include_attachments', False))
    suppliers_mode = str(payload.get('suppliers_mode') or 'all').strip().lower()
    if suppliers_mode not in ('all', 'main'):
        suppliers_mode = 'all'

    # Fetch projects
    projects = list(Project.objects.filter(id__in=[str(x) for x in project_ids]))
    # keep order of requested ids
    proj_by_id = {str(p.id): p for p in projects}
    projects = [proj_by_id.get(str(pid)) for pid in project_ids if proj_by_id.get(str(pid))]
    if not projects:
        return JsonResponse({'error': 'No projects found for given IDs'}, status=404)

    def safe_num(v):
        try:
            s = str(v).replace(',', '.').strip()
            if not s:
                return 0.0
            return float(s)
        except Exception:
            return 0.0

    def as_date(v):
        s = str(v or '').strip()
        return s.split('T')[0] if s else ''

    MAX_TIERS = 10  # standard export tiers (Qty/Price 1..10)

    def _qty_cols(it):
        cols = {}
        for i in range(1, MAX_TIERS + 1):
            cols[f'qty_{i}'] = it.get(f'qty_{i}') or ''
        extra = []
        for k, v in (it or {}).items():
            if not isinstance(k, str) or not k.startswith('qty_'):
                continue
            try:
                idx = int(k.split('_')[1])
            except Exception:
                continue
            if idx > MAX_TIERS:
                sv = str(v).strip()
                if sv:
                    extra.append((idx, sv))
        extra.sort(key=lambda t: t[0])
        cols['qty_next'] = " | ".join([f"qty_{i}={v}" for i, v in extra])
        return cols

    def _pick_main_supplier(it, main_name):
        sups = it.get('suppliers') or []
        if not isinstance(sups, list):
            return None
        for s in sups:
            if isinstance(s, dict) and (s.get('isMain') or s.get('is_main')):
                return s
        if main_name:
            mn = str(main_name).strip().lower()
            for s in sups:
                if not isinstance(s, dict):
                    continue
                sname = (s.get('name') or s.get('supplier_name') or s.get('supplier') or '')
                if str(sname).strip().lower() == mn:
                    return s
        for s in sups:
            if isinstance(s, dict):
                return s
        return None

    def _supplier_price_list(s):
        if not isinstance(s, dict):
            return []
        prices = s.get('prices')
        if isinstance(prices, list) and prices:
            tmp = []
            for x in prices:
                if not isinstance(x, dict):
                    continue
                q = safe_num(x.get('qty') or x.get('quantity') or x.get('break') or x.get('qty_break') or '')
                pv = x.get('price') or x.get('unit_price') or x.get('unit') or x.get('value') or ''
                tmp.append((q, pv))
            tmp.sort(key=lambda t: (t[0] == 0, t[0]))
            return [pv for _, pv in tmp]
        out = []
        out.append(s.get('price_1') or s.get('price') or '')
        for i in range(2, 31):
            out.append(s.get(f'price_{i}') or '')
        while out and str(out[-1]).strip() == '':
            out.pop()
        return out

    def _price_cols(it, s):
        cols = {}
        plist = _supplier_price_list(s)
        for i in range(1, MAX_TIERS + 1):
            v = ''
            if i - 1 < len(plist):
                v = plist[i - 1]
            if not str(v).strip():
                v = (it.get('price_1') or it.get('price') or '') if i == 1 else (it.get(f'price_{i}') or '')
            cols[f'price_{i}'] = v or ''
        extra = []
        for idx in range(MAX_TIERS + 1, len(plist) + 1):
            v = plist[idx - 1]
            if str(v).strip():
                extra.append((idx, str(v).strip()))
        cols['price_next'] = " | ".join([f"price_{i}={v}" for i, v in extra])
        return cols

    # Flatten data
    rows_projects = []
    rows_items = []
    rows_item_sups = []
    rows_suppliers = []
    rows_rfqs = []
    rows_atts = []

    supplier_agg = {}  # (proj_id, sup_name) -> dict

    for p in projects:
        pdata = p.data or {}
        rows_projects.append({
            'project_id': p.id,
            'project_name': p.name,
            'project_status': pdata.get('project_status') or pdata.get('status') or '',
            'created_at': as_date(pdata.get('created_at') or p.created_at),
            'updated_at': as_date(pdata.get('updated_at') or p.updated_at),
            'deadline': (pdata.get('dates') or {}).get('deadline') or pdata.get('deadline') or '',
            'sent_to': pdata.get('sent_to') or '',
            'notes_count': len(pdata.get('notes') or []),
            'items_count': len(pdata.get('items') or []),
            'rfq_bundles': len(pdata.get('rfqBatches') or pdata.get('rfq_batches') or []),
        })

        items = pdata.get('items') or []
        batches = pdata.get('rfqBatches') or pdata.get('rfq_batches') or []

        if include_rfqs:
            for b in batches:
                if not isinstance(b, dict): 
                    continue
                rows_rfqs.append({
                    'project_id': p.id,
                    'project_name': p.name,
                    'bundle_id': b.get('id') or '',
                    'supplier': b.get('supplier_name') or b.get('supplier') or '',
                    'status': b.get('status') or '',
                    'created_at': as_date(b.get('created_at')),
                    'due_date': b.get('due_date') or '',
                    'items_count': len(b.get('items') or []),
                    'currency': b.get('currency') or '',
                    'note': b.get('note') or '',
                })

        if include_items:
            for it in items:
                if not isinstance(it, dict): 
                    continue
                dn = it.get('item_drawing_no') or it.get('drawing_no') or it.get('line') or ''
                main_sup = it.get('supplier') or ''
                main_price = it.get('price_1') or it.get('price') or ''
                main_cur = it.get('currency') or 'EUR'
                rows_items.append({
                    'project_id': p.id,
                    'project_name': p.name,
                    'drawing_no': dn,
                    'description': it.get('description') or '',
                    'manufacturer': it.get('manufacturer') or '',
                    'mpn': it.get('mpn') or it.get('MPN') or it.get('manufacturer_part_no') or it.get('mfr_part_no') or it.get('part_no') or '',
                    'status': it.get('status') or '',
                    'main_supplier': main_sup,
                    'currency': main_cur,
                    'suppliers_count': len(it.get('suppliers') or []) if isinstance(it.get('suppliers'), list) else 0,
                    'lead_time': it.get('lead_time') or '',
                    'shipping_cost': it.get('shipping_cost') or '',
                })
                # Expand Items sheet with Qty/Price tiers (1..10 + next)
                try:
                    rows_items[-1].update(_qty_cols(it))
                    rows_items[-1].update(_price_cols(it, _pick_main_supplier(it, main_sup)))
                except Exception:
                    pass

                if include_item_suppliers:
                    sups = it.get('suppliers') or []
                    if not isinstance(sups, list):
                        sups = []
                    for s in sups:
                        if not isinstance(s, dict):
                            continue
                        sname = s.get('name') or s.get('supplier_name') or s.get('supplier') or ''
                        if not sname:
                            continue
                        is_main = bool(s.get('isMain') or (main_sup and str(main_sup).strip().lower() == str(sname).strip().lower()))
                        if suppliers_mode == 'main' and not is_main:
                            continue

                        row = {
                            'project_id': p.id,
                            'project_name': p.name,
                            'drawing_no': dn,
                            'supplier': sname,
                            'is_main': 'YES' if is_main else '',
                            'status': s.get('status') or '',
                            'currency': s.get('currency') or main_cur,
                            'price_raw': s.get('price') or '',
                            'moq': s.get('moq') or '',
                            'mov': s.get('mov') or '',
                            'lead_time': s.get('lead_time') or '',
                            'shipping_cost': s.get('shipping_cost') or s.get('shipping') or '',
                            'payment_terms': s.get('payment_terms') or '',
                            'incoterms': s.get('incoterms') or '',
                            'valid_until': s.get('valid_until') or s.get('quote_valid_until') or '',
                            'notes': s.get('notes') or '',
                        }
                        # Standardize Qty/Price tiers in export (1..10 + next)
                        try:
                            row.update(_qty_cols(it))
                            if include_price_breaks:
                                row.update(_price_cols(it, s))
                            else:
                                base_prices = {f'price_{i}': '' for i in range(1, MAX_TIERS + 1)}
                                base_prices['price_1'] = s.get('price_1') or s.get('price') or ''
                                base_prices['price_next'] = ''
                                row.update(base_prices)
                        except Exception:
                            pass
                        rows_item_sups.append(row)


                        # aggregate per supplier
                        key = (str(p.id), str(sname).strip())
                        agg = supplier_agg.get(key)
                        if not agg:
                            agg = supplier_agg[key] = {
                                'project_id': p.id,
                                'project_name': p.name,
                                'supplier': str(sname).strip(),
                                'items': set(),
                                'main_items': set(),
                                'quoted_items': set(),
                                'avg_price_eur_sum': 0.0,
                                'avg_price_eur_cnt': 0,
                            }
                        if dn:
                            agg['items'].add(str(dn))
                            if is_main:
                                agg['main_items'].add(str(dn))
                            price_val = safe_num(s.get('price_1') or s.get('price') or 0)
                            if price_val > 0:
                                agg['quoted_items'].add(str(dn))
                                agg['avg_price_eur_sum'] += price_val
                                agg['avg_price_eur_cnt'] += 1

        if include_attachments:
            for a in Attachment.objects.filter(project=p).order_by('-uploaded_at'):
                rows_atts.append({
                    'project_id': p.id,
                    'project_name': p.name,
                    'attachment_id': a.id,
                    'kind': a.kind,
                    'file': a.file.name if a.file else '',
                    'uploaded_at': as_date(a.uploaded_at),
                })

    # finalize supplier agg
    for agg in supplier_agg.values():
        rows_suppliers.append({
            'project_id': agg['project_id'],
            'project_name': agg['project_name'],
            'supplier': agg['supplier'],
            'items_count': len(agg['items']),
            'main_items': len(agg['main_items']),
            'quoted_items': len(agg['quoted_items']),
            'avg_price': (agg['avg_price_eur_sum'] / agg['avg_price_eur_cnt']) if agg['avg_price_eur_cnt'] else '',
        })


    # --- STANDARDIZE EXPORT HEADERS (ensure tier columns exist on every row) ---
    try:
        _tier_qty_keys = [f'qty_{i}' for i in range(1, MAX_TIERS + 1)] + ['qty_next']
        _tier_price_keys = [f'price_{i}' for i in range(1, MAX_TIERS + 1)] + ['price_next']
        for _r in rows_items:
            for _k in _tier_qty_keys + _tier_price_keys:
                _r.setdefault(_k, '')
        for _r in rows_item_sups:
            for _k in _tier_qty_keys + _tier_price_keys:
                _r.setdefault(_k, '')
    except Exception:
        pass

    # CSV: keep it simple (items only)
    if fmt == 'csv':
        import csv
        import io
        out = io.StringIO()
        if not include_items:
            out.write("Nothing selected for export\n")
        else:
            headers = (
                ['project_id','project_name','drawing_no','description','manufacturer','mpn','status',
                 'main_supplier','currency','suppliers_count','lead_time','shipping_cost']
                + [f'qty_{i}' for i in range(1, MAX_TIERS + 1)] + ['qty_next']
                + [f'price_{i}' for i in range(1, MAX_TIERS + 1)] + ['price_next']
            )
            w = csv.DictWriter(out, fieldnames=headers)
            w.writeheader()
            for r in rows_items:
                w.writerow({k: r.get(k, '') for k in headers})
        data = out.getvalue().encode('utf-8-sig')
        resp = HttpResponse(data, content_type='text/csv; charset=utf-8')
        resp['Content-Disposition'] = 'attachment; filename="rfq_export.csv"'
        return resp

    if fmt == 'pdf':
        # PDF summary (ReportLab)
        try:
            from reportlab.lib.pagesizes import A4
            from reportlab.pdfgen import canvas
            from reportlab.lib.units import mm
        except Exception as e:
            return JsonResponse({'error': f'ReportLab not available: {e}'}, status=500)

        import io
        buf = io.BytesIO()
        c = canvas.Canvas(buf, pagesize=A4)
        width, height = A4
        y = height - 18*mm

        c.setFont("Helvetica-Bold", 14)
        c.drawString(18*mm, y, "RFQ Export Summary")
        y -= 10*mm

        c.setFont("Helvetica", 10)
        for rp in rows_projects:
            line = f"{rp['project_name']} ({rp['project_id']}) — Status: {rp.get('project_status','')} — Items: {rp.get('items_count','')} — Bundles: {rp.get('rfq_bundles','')}"
            c.drawString(18*mm, y, line[:120])
            y -= 6*mm
            if y < 20*mm:
                c.showPage()
                y = height - 18*mm
                c.setFont("Helvetica", 10)

        y -= 4*mm
        c.setFont("Helvetica-Bold", 12)
        c.drawString(18*mm, y, "Top suppliers (by quoted items)")
        y -= 8*mm
        c.setFont("Helvetica", 10)
        top = sorted(rows_suppliers, key=lambda x: (x.get('quoted_items') or 0, x.get('items_count') or 0), reverse=True)[:20]
        for s in top:
            line = f"{s['project_name']} — {s['supplier']} — Items: {s['items_count']} — Quoted: {s['quoted_items']} — Main: {s['main_items']}"
            c.drawString(18*mm, y, line[:120])
            y -= 6*mm
            if y < 20*mm:
                c.showPage()
                y = height - 18*mm
                c.setFont("Helvetica", 10)

        c.save()
        buf.seek(0)
        resp = HttpResponse(buf.read(), content_type='application/pdf')
        resp['Content-Disposition'] = 'attachment; filename="rfq_export.pdf"'
        return resp

    # XLSX
    try:
        from openpyxl import Workbook
        from openpyxl.utils import get_column_letter
    except Exception as e:
        return JsonResponse({'error': f'openpyxl not available: {e}'}, status=500)

    wb = Workbook()
    wb.remove(wb.active)

    def add_sheet(title, rows, headers=None):
        ws = wb.create_sheet(title=title[:31])
        if not rows:
            ws.append(["(no data)"])
            return
        if headers is None:
            # union of keys (deterministic, avoids missing tier columns)
            keyset = set()
            for r in rows:
                if isinstance(r, dict):
                    keyset.update(r.keys())
            headers = list(keyset)
            headers.sort(key=lambda x: str(x))
        ws.append(headers)
        for r in rows:
            ws.append([r.get(h, '') for h in headers])
        # basic column widths
        for i, h in enumerate(headers, start=1):
            ws.column_dimensions[get_column_letter(i)].width = min(42, max(10, len(str(h)) + 2))

    # Header presets (keep tier columns always visible)
    ITEM_HEADERS_BASE = [
        'project_id','project_name','drawing_no','description','manufacturer','mpn','status',
        'main_supplier','currency','suppliers_count','lead_time','shipping_cost'
    ]
    ITEM_SUP_HEADERS_BASE = [
        'project_id','project_name','drawing_no','supplier','is_main','status','currency',
        'price_raw','moq','mov','lead_time','shipping_cost','payment_terms','incoterms','valid_until','notes'
    ]
    TIER_Q_HEADERS = [f'qty_{i}' for i in range(1, MAX_TIERS + 1)] + ['qty_next']
    TIER_P_HEADERS = [f'price_{i}' for i in range(1, MAX_TIERS + 1)] + ['price_next']
    ITEM_HEADERS = ITEM_HEADERS_BASE + TIER_Q_HEADERS + TIER_P_HEADERS
    ITEM_SUP_HEADERS = ITEM_SUP_HEADERS_BASE + TIER_Q_HEADERS + TIER_P_HEADERS

    add_sheet("Projects", rows_projects)
    if include_items:
        add_sheet("Items", rows_items, headers=ITEM_HEADERS)
    if include_item_suppliers:
        add_sheet("ItemSuppliers", rows_item_sups, headers=ITEM_SUP_HEADERS)
    if include_rfqs:
        add_sheet("RFQs", rows_rfqs)
    add_sheet("Suppliers", rows_suppliers)
    if include_attachments:
        add_sheet("Attachments", rows_atts)

    import io
    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    resp = HttpResponse(buf.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    resp['Content-Disposition'] = 'attachment; filename="rfq_export.xlsx"'
    return resp


# --- SUPPLIER INTERACTION API ---


def _extract_items_for_supplier(project_data, supplier_name):
    """Extract items assigned to a supplier from project data. Returns list of item dicts."""
    items = (project_data or {}).get('items') or []
    sname_norm = _normalize_name(supplier_name).lower()
    extracted = []
    for it in items:
        if not isinstance(it, dict):
            continue
        is_assigned = _normalize_name(it.get('supplier') or '').lower() == sname_norm
        is_in_list = False
        sups = it.get('suppliers') or []
        if isinstance(sups, list):
            for s in sups:
                if isinstance(s, dict) and _normalize_name(s.get('name') or s.get('supplier') or '').lower() == sname_norm:
                    is_in_list = True
                    break
        if is_assigned or is_in_list:
            entry = {
                'id': it.get('id'),
                'item_drawing_no': it.get('item_drawing_no') or it.get('drawing_no') or '',
                'drawing_no': it.get('drawing_no') or it.get('item_drawing_no') or '',
                'line': it.get('line') or '',
                'description': it.get('description') or '',
                'manufacturer': it.get('manufacturer') or '',
                'mpn': it.get('mpn') or '',
                'uom': it.get('uom') or 'pcs',
                'target_price': it.get('target_price') or '',
            }
            # Dynamic qty tiers: scan for qty_1 through qty_10
            for i in range(1, 11):
                key = f'qty_{i}'
                val = it.get(key)
                if val is None and i == 1:
                    val = it.get('qty') or ''
                entry[key] = val if val is not None else ''
            extracted.append(entry)
    return extracted


@csrf_exempt
def supplier_access_generate(request):
    """
    Generate a secure link (SupplierAccess) for a specific supplier on a project.
    Body: { "project_id": "...", "supplier_name": "..." }
    """
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    auth_err = _require_buyer_auth(request)
    if auth_err:
        return auth_err
        
    payload = _json_body(request) or {}
    pid = str(payload.get('project_id') or '')
    sname = str(payload.get('supplier_name') or '').strip()

    if not pid or not sname:
        return JsonResponse({'error': 'project_id and supplier_name required'}, status=400)

    try:
        proj = Project.objects.get(id=pid)
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)

    extracted = _extract_items_for_supplier(proj.data, sname)

    # Parse valid_until if provided
    vu = None
    vu_raw = payload.get('valid_until')
    if vu_raw:
        from django.utils.dateparse import parse_datetime, parse_date
        vu = parse_datetime(str(vu_raw))
        if not vu:
            d = parse_date(str(vu_raw))
            if d:
                from datetime import datetime, time as dtime
                from django.utils import timezone
                vu = timezone.make_aware(datetime.combine(d, dtime(23, 59, 59)))

    # Create Access Token
    token = uuid.uuid4().hex
    access = SupplierAccess(
        id=token,
        project=proj,
        supplier_name=sname,
        requested_items=extracted,
        submission_data={},
        status='sent',
        round=1,
        valid_until=vu,
        contact_name=str(payload.get('contact_name') or '').strip()[:255],
        contact_email=str(payload.get('contact_email') or '').strip()[:255],
        contact_phone=str(payload.get('contact_phone') or '').strip()[:64],
        instruction_message=str(payload.get('instruction_message') or '').strip(),
    )
    access.save()

    return JsonResponse({'access': access.as_dict()})


@csrf_exempt
def supplier_access_viewed(request, token):
    """
    Mark the portal as viewed when opened.
    POST /api/supplier_access/<token>/viewed
    """
    if request.method != 'POST': return HttpResponseNotAllowed(['POST'])
    try:
        access = SupplierAccess.objects.get(id=token)
        if access.status in ['sent', 're_quote_requested']:
            from django.utils import timezone
            if not access.viewed_at:
                access.viewed_at = timezone.now()
            access.status = 'viewed'
            access.save()
        return JsonResponse({'ok': True})
    except SupplierAccess.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)


@csrf_exempt
def supplier_portal_save_draft(request, token):
    """Save supplier's work-in-progress without final submission."""
    try:
        access = SupplierAccess.objects.get(id=token)
    except SupplierAccess.DoesNotExist:
        return JsonResponse({'error': 'Invalid token'}, status=404)

    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    if access.status not in ['sent', 'viewed', 're_quote_requested']:
        return JsonResponse({'error': 'This quote is closed or already submitted.'}, status=403)

    data = _json_body(request) or {}

    # Sanitize
    data['supplier_contact_name'] = str(data.get('supplier_contact_name') or '').strip()[:255]
    data['supplier_contact_email'] = str(data.get('supplier_contact_email') or '').strip()[:255]
    data['supplier_contact_phone'] = str(data.get('supplier_contact_phone') or '').strip()[:64]
    data['is_draft'] = True

    access.submission_data = data
    if access.status == 'sent':
        access.status = 'viewed'
    access.save()

    return JsonResponse({'ok': True, 'message': 'Draft saved'})


@csrf_exempt
def supplier_portal_submit(request, token):
    """
    Supplier submits quote.
    Supports Multipart (files) or JSON.
    """
    try:
        access = SupplierAccess.objects.get(id=token)
    except SupplierAccess.DoesNotExist:
        return JsonResponse({'error': 'Invalid token'}, status=404)
        
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    # Validation: Can only submit if editable
    if access.status not in ['sent', 'viewed', 're_quote_requested']:
        return JsonResponse({'error': 'This quote is closed or already submitted.'}, status=403)

    data = {}
    files = []

    # Handle Content Types
    if request.content_type.startswith('multipart'):
        raw_data = request.POST.get('data')
        if raw_data:
            try:
                data = json.loads(raw_data)
            except (ValueError, TypeError) as e:
                logger.warning("supplier_portal_submit: JSON parse error: %s", e)
        files = request.FILES.getlist('files') or request.FILES.getlist('files[]')
    else:
        data = _json_body(request) or {}

    # File upload validation
    ALLOWED_EXTENSIONS = {'.pdf', '.xlsx', '.xls', '.csv', '.doc', '.docx', '.png', '.jpg', '.jpeg'}
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB per file
    for f in files:
        ext = os.path.splitext(f.name)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            return JsonResponse({'error': f'File type {ext} not allowed'}, status=400)
        if f.size > MAX_FILE_SIZE:
            return JsonResponse({'error': f'File {f.name} exceeds 10 MB limit'}, status=400)

    # Sanitize supplier contact fields
    data['supplier_contact_name'] = str(data.get('supplier_contact_name') or '').strip()[:255]
    data['supplier_contact_email'] = str(data.get('supplier_contact_email') or '').strip()[:255]
    data['supplier_contact_phone'] = str(data.get('supplier_contact_phone') or '').strip()[:64]

    from django.utils import timezone
    now = timezone.now()

    with transaction.atomic():
        # 1. Update Current Submission
        access.submission_data = data
        access.status = 'submitted'
        access.submitted_at = now
        # Also set replied_at for legacy compat
        access.replied_at = now
        access.save()

        # 2. Create History Snapshot (Round)
        round_rec = SupplierAccessRound.objects.create(
            supplier_access=access,
            round=access.round,
            requested_items=access.requested_items,
            submission_data=data,
            submitted_at=now,
            buyer_decision=None
        )

        # 3. Save Files
        for f in files:
            SupplierInteractionFile.objects.create(
                supplier_access=access,
                round=access.round,
                file=f,
                original_name=f.name,
                size=f.size,
                uploaded_by='supplier'
            )

    return JsonResponse({'ok': True})


@csrf_exempt
def supplier_access_approve(request, token):
    """
    Buyer approves the submission -> Syncs data to Project items + metadata.
    """
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    auth_err = _require_buyer_auth(request)
    if auth_err:
        return auth_err

    try:
        access = SupplierAccess.objects.get(id=token)
    except SupplierAccess.DoesNotExist:
        return JsonResponse({'error': 'Invalid token'}, status=404)

    from django.utils import timezone
    now = timezone.now()
    user = _get_buyer_username(request)

    submission = access.submission_data or {}
    sub_items = submission.get('items') or []

    # Quote-level fields from supplier submission
    quote_currency = str(submission.get('currency') or 'EUR')
    quote_shipping = str(submission.get('shipping') or '')
    quote_incoterms = str(submission.get('incoterms') or '')
    quote_payment_terms = str(submission.get('payment_terms') or '')
    quote_number = str(submission.get('quote_number') or '')
    quote_valid_until = str(submission.get('quote_valid_until') or '')
    quote_packaging = str(submission.get('packaging') or '')

    # Build lookup: items with ID go into sub_map, items without into sub_no_id
    sub_map = {}
    sub_no_id = []
    for si in sub_items:
        if not isinstance(si, dict):
            continue
        if si.get('id'):
            sub_map[str(si['id'])] = si
        else:
            sub_no_id.append(si)

    updates_count = 0
    unmatched_count = 0
    all_candidates = list(sub_map.values()) + sub_no_id
    sup_name_norm = _normalize_name(access.supplier_name).lower()

    with transaction.atomic():
        # Lock project row to prevent concurrent overwrites
        proj = Project.objects.select_for_update().get(id=access.project_id)
        pdata = proj.data or {}
        items = pdata.get('items') or []

        for it in items:
            it_id = str(it.get('id') or '')

            # MATCHING LOGIC (Robust):
            # 1. Try exact ID match
            sub_entry = sub_map.get(it_id)

            # 2. Fallback: Drawing Number / MPN (search ALL candidates incl. no-id)
            if not sub_entry:
                p_dn = str(it.get('item_drawing_no') or it.get('drawing_no') or '').strip().lower()
                p_mpn = str(it.get('mpn') or '').strip().lower()

                for cand in all_candidates:
                    c_dn = str(cand.get('item_drawing_no') or cand.get('drawing_no') or '').strip().lower()
                    c_mpn = str(cand.get('mpn') or '').strip().lower()

                    if p_dn and c_dn and c_dn == p_dn:
                        sub_entry = cand
                        break
                    elif p_mpn and c_mpn and c_mpn == p_mpn:
                        sub_entry = cand
                        break

            if not sub_entry:
                unmatched_count += 1
                continue

            try:
                raw_price = str(sub_entry.get('price') or '').replace(',', '.')
                if not raw_price:
                    continue
                new_price = float(Decimal(raw_price))
            except (ValueError, InvalidOperation):
                continue

            new_moq = sub_entry.get('moq') or ''
            new_lead = sub_entry.get('lead_time') or ''
            new_comment = sub_entry.get('notes') or sub_entry.get('comment') or ''

            # Update 'suppliers' list in item
            sups = it.get('suppliers') or []
            if not isinstance(sups, list):
                sups = []

            # Find or Create entry
            # Common supplier entry fields (quote-level + per-item)
            sup_fields = {
                'price': new_price,
                'price_1': new_price,
                'moq': new_moq,
                'lead_time': new_lead,
                'currency': quote_currency,
                'shipping': quote_shipping,
                'incoterms': quote_incoterms,
                'payment_terms': quote_payment_terms,
                'quote_number': quote_number,
                'quote_valid_until': quote_valid_until,
                'packaging': quote_packaging,
                'status': 'Quoted',
                'quote_status': 'Quoted',
                'rfq_sent_date': access.created_at.strftime('%Y-%m-%d'),
                'quote_received_date': (access.submitted_at or now).strftime('%Y-%m-%d'),
                'source': 'supplier_interaction',
                'interaction_id': access.id,
                'round': access.round,
                'note': new_comment,
                'isMain': True,
            }
            # Tier prices (dynamic: price_2 through price_10)
            for tier_i in range(2, 11):
                tk = f'price_{tier_i}'
                raw_tier = str(sub_entry.get(tk) or '').replace(',', '.').strip()
                if raw_tier:
                    try:
                        sup_fields[tk] = float(Decimal(raw_tier))
                    except (ValueError, InvalidOperation):
                        pass

            # Build 'prices' array from item qty tiers for RFQ Planner compatibility
            prices_arr = []
            for tier_idx in range(1, 11):
                qty_val = it.get(f'qty_{tier_idx}')
                if qty_val is not None and str(qty_val).strip():
                    price_key = f'price_{tier_idx}' if tier_idx > 1 else 'price'
                    tier_price = sup_fields.get(f'price_{tier_idx}') or sup_fields.get(price_key, '')
                    prices_arr.append({
                        'qty': qty_val,
                        'price': tier_price if tier_price else '',
                        'index': tier_idx,
                    })
            if prices_arr:
                sup_fields['prices'] = prices_arr

            found = False
            for s in sups:
                if isinstance(s, dict):
                    sname = s.get('supplier_name') or s.get('name') or s.get('supplier') or ''
                    if _normalize_name(sname).lower() == sup_name_norm:
                        s.update(sup_fields)
                        found = True
                        break

            if not found:
                sup_fields['name'] = access.supplier_name
                sup_fields['supplier_name'] = access.supplier_name
                sups.append(sup_fields)

            it['suppliers'] = sups

            # Tag Item Metadata
            it['price_source'] = 'supplier_interaction'
            it['last_interaction_id'] = access.id
            it['last_approved_by'] = user
            it['last_approved_at'] = now.isoformat()
            it['quote_round'] = access.round

            # Update main columns (for "Price Comparison" and "RFQ Planner" visibility)
            it['supplier'] = access.supplier_name
            it['price_1'] = new_price
            it['currency'] = quote_currency
            it['moq'] = new_moq
            it['lead_time'] = new_lead
            # Mark item status as quoted
            if str(it.get('status') or '') not in ('Done', 'Closed'):
                it['status'] = 'Quoted'
            # Tier prices on item level (dynamic: price_2 through price_10)
            for tier_i in range(2, 11):
                tk = f'price_{tier_i}'
                raw_tier = str(sub_entry.get(tk) or '').replace(',', '.').strip()
                if raw_tier:
                    try:
                        it[tk] = float(Decimal(raw_tier))
                    except (ValueError, InvalidOperation):
                        pass

            updates_count += 1

        proj.data = pdata
        proj.save()

        # 2. Access Status Update
        access.status = 'approved'
        access.approved_at = now
        access.approved_by = user
        access.save()

        # 3. History Record Update
        round_rec = SupplierAccessRound.objects.filter(supplier_access=access, round=access.round).first()
        if not round_rec:
            round_rec = SupplierAccessRound.objects.create(
                supplier_access=access,
                round=access.round,
                requested_items=access.requested_items,
                submission_data=access.submission_data,
                submitted_at=access.submitted_at,
            )
        round_rec.buyer_decision = 'approved'
        round_rec.decision_by = user
        round_rec.decision_at = now
        round_rec.save()

    logger.info("Approved %d/%d items for %s (unmatched: %d)", updates_count, len(items), access.supplier_name, unmatched_count)
    return JsonResponse({'ok': True, 'updated_items': updates_count, 'unmatched_items': unmatched_count})


@csrf_exempt
def supplier_access_reject(request, token):
    """
    Buyer rejects/requotes/marks lost.
    Body: { "action": "re_quote"|"lost"|"reject", "reason": "..." }
    """
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    auth_err = _require_buyer_auth(request)
    if auth_err:
        return auth_err

    try:
        access = SupplierAccess.objects.get(id=token)
    except SupplierAccess.DoesNotExist:
        return JsonResponse({'error': 'Invalid token'}, status=404)

    payload = _json_body(request) or {}
    action = payload.get('action')
    reason = payload.get('reason') or ''

    if not reason:
        return JsonResponse({'error': 'Reason is required'}, status=400)

    from django.utils import timezone
    now = timezone.now()
    user = _get_buyer_username(request)

    with transaction.atomic():
        # Update current round history logic
        round_rec = SupplierAccessRound.objects.filter(supplier_access=access, round=access.round).first()
        if not round_rec:
            # Should exist if submitted
            round_rec = SupplierAccessRound.objects.create(
                supplier_access=access,
                round=access.round,
                requested_items=access.requested_items,
                submission_data=access.submission_data,
                submitted_at=access.submitted_at
            )
        
        round_rec.decision_by = user
        round_rec.decision_at = now
        round_rec.decision_reason = reason
        
        if action == 're_quote':
            round_rec.buyer_decision = 're_quote'
            round_rec.save()
            
            # Start New Round
            access.round += 1
            access.status = 're_quote_requested'
            access.rejection_reason = reason
            # We keep submission_data as is? Or clear it?
            # UX: Keep it so portal can pre-fill. But conceptually it's a new round.
            # We will KEEP it, frontend can choose to use it.
            # But the 'submitted_at' should be cleared for the new round tracking
            access.submitted_at = None
            access.approved_at = None
            access.approved_by = None

            # Refresh requested_items from current project state
            try:
                refreshed = _extract_items_for_supplier(access.project.data, access.supplier_name)
                if refreshed:
                    access.requested_items = refreshed
            except Exception:
                logger.warning("Could not refresh requested_items for re-quote %s", access.id)
            
        elif action == 'lost':
            round_rec.buyer_decision = 'lost'
            round_rec.save()
            access.status = 'lost'
            access.rejection_reason = reason
            
        elif action == 'reject':
            round_rec.buyer_decision = 'rejected'
            round_rec.save()
            access.status = 'rejected'
            access.rejection_reason = reason
            
        else:
            return JsonResponse({'error': 'Invalid action'}, status=400)
            
        access.save()

    return JsonResponse({'ok': True, 'new_status': access.status, 'round': access.round})


@csrf_exempt
def project_supplier_access_list(request, project_id):
    """
    List all tokens with full status for Manager Dashboard.
    """
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])

    auth_err = _require_buyer_auth(request)
    if auth_err:
        return auth_err
        
    pid = str(project_id)
    qs = SupplierAccess.objects.filter(project_id=pid).order_by('-created_at')
    
    data = []
    for acc in qs:
        d = acc.as_dict()
        # Add summary of submission
        if acc.submission_data:
            sub = acc.submission_data
            d['submission_summary'] = {
                'notes': sub.get('notes'),
                'items_count': len(sub.get('items') or [])
            }
        
        # Add files
        d['files'] = [f.as_dict() for f in acc.files.all()]

        # Add round history
        d['round_history'] = []
        for r in acc.rounds.all():
            d['round_history'].append({
                'round': r.round,
                'submission_data': r.submission_data or {},
                'submitted_at': r.submitted_at.isoformat() if r.submitted_at else None,
                'buyer_decision': r.buyer_decision or '',
                'decision_reason': r.decision_reason or '',
                'decision_by': r.decision_by or '',
                'decision_at': r.decision_at.isoformat() if r.decision_at else None,
            })

        # Add validation info
        d['validation'] = {
            'is_complete': acc._check_completeness(),
            'rejection_reason': acc.rejection_reason
        }
        data.append(d)
        
    return JsonResponse({'accesses': data})


@csrf_exempt
def supplier_interaction_file_download(request, file_id):
    """
    Secure file download.
    Queries: ?token=... (optional, if supplier)
    """
    if request.method != 'GET': return HttpResponseNotAllowed(['GET'])
    
    try:
        f = SupplierInteractionFile.objects.get(id=file_id)
    except SupplierInteractionFile.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)
        
    # Auth Logic
    has_access = False
    
    # 1. Buyer (Session)
    if request.user.is_authenticated:
        has_access = True
        
    # 2. Supplier (Token)
    token = request.GET.get('token')
    if token and f.supplier_access.id == token:
        has_access = True
        
    if not has_access:
        return HttpResponse("Unauthorized", status=403)
        
    from django.http import FileResponse
    try:
        resp = FileResponse(f.file.open('rb'))
        resp['Content-Disposition'] = f'attachment; filename="{f.original_name}"'
        return resp
    except Exception:
        return HttpResponse("File missing", status=404)


@csrf_exempt
def supplier_access_request_reopen(request, token):
    """Supplier requests re-opening of their submission (no auth needed — token IS auth)."""
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    try:
        access = SupplierAccess.objects.get(id=token)
    except SupplierAccess.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    if access.is_editable:
        return JsonResponse({'error': 'Already editable'}, status=400)

    payload = _json_body(request) or {}
    reason = str(payload.get('reason') or '').strip()
    if not reason:
        return JsonResponse({'error': 'Reason is required'}, status=400)

    from django.utils import timezone
    sd = access.submission_data or {}
    sd['reopen_requested'] = True
    sd['reopen_requested_at'] = timezone.now().isoformat()
    sd['reopen_reason'] = reason
    access.submission_data = sd
    access.save(update_fields=['submission_data'])

    return JsonResponse({'ok': True, 'message': 'Re-opening request sent to buyer.'})


@csrf_exempt
def supplier_access_update_items(request, token):
    """Buyer adds newly-assigned items to an existing portal (without re-quoting)."""
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    auth_err = _require_buyer_auth(request)
    if auth_err:
        return auth_err

    try:
        access = SupplierAccess.objects.select_for_update().get(id=token)
    except SupplierAccess.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    from django.utils import timezone

    with transaction.atomic():
        current_items = access.requested_items or []
        # Build set of existing item identifiers
        existing_ids = set()
        existing_drawings = set()
        existing_mpns = set()
        for ci in current_items:
            if ci.get('id'):
                existing_ids.add(str(ci['id']))
            drawing = ci.get('item_drawing_no') or ci.get('drawing_no') or ''
            if drawing:
                existing_drawings.add(drawing)
            if ci.get('mpn'):
                existing_mpns.add(str(ci['mpn']))

        fresh = _extract_items_for_supplier(access.project.data, access.supplier_name)
        new_items = []
        now_iso = timezone.now().isoformat()
        for fi in fresh:
            # Check if already in current items
            if fi.get('id') and str(fi['id']) in existing_ids:
                continue
            drawing = fi.get('item_drawing_no') or fi.get('drawing_no') or ''
            if drawing and drawing in existing_drawings:
                continue
            if fi.get('mpn') and str(fi['mpn']) in existing_mpns:
                continue
            fi['added_at'] = now_iso
            new_items.append(fi)

        if not new_items:
            return JsonResponse({'ok': True, 'message': 'No new items to add.', 'new_count': 0})

        access.requested_items = current_items + new_items
        # Reset status so supplier sees the update
        if access.status in ('submitted', 'approved', 'rejected', 'lost'):
            access.status = 'sent'
            access.submitted_at = None
            access.approved_at = None
            access.approved_by = None
        access.save()

    return JsonResponse({
        'ok': True,
        'message': f'{len(new_items)} item(s) added.',
        'new_count': len(new_items),
        'access': access.as_dict()
    })


@csrf_exempt
def supplier_access_cancel(request, token):
    """Buyer cancels/invalidates a supplier portal link."""
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    auth_err = _require_buyer_auth(request)
    if auth_err:
        return auth_err

    try:
        access = SupplierAccess.objects.get(id=token)
    except SupplierAccess.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    access.status = 'expired'
    access.save(update_fields=['status'])

    return JsonResponse({'ok': True, 'access': access.as_dict()})


@csrf_exempt
def supplier_access_reopen_buyer(request, token):
    """Buyer reopens a closed portal (rejected/lost/expired)."""
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    auth_err = _require_buyer_auth(request)
    if auth_err:
        return auth_err

    try:
        access = SupplierAccess.objects.get(id=token)
    except SupplierAccess.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    if access.status not in ('rejected', 'lost', 'expired'):
        return JsonResponse({'error': 'Only closed portals can be reopened.'}, status=400)

    from django.utils import timezone

    with transaction.atomic():
        access.round += 1
        access.status = 're_quote_requested'
        access.submitted_at = None
        access.approved_at = None
        access.approved_by = None
        # Clear reopen_requested flag if set
        sd = access.submission_data or {}
        sd.pop('reopen_requested', None)
        sd.pop('reopen_requested_at', None)
        sd.pop('reopen_reason', None)
        access.submission_data = sd
        # Refresh items from project
        try:
            refreshed = _extract_items_for_supplier(access.project.data, access.supplier_name)
            if refreshed:
                access.requested_items = refreshed
        except Exception:
            logger.warning("Could not refresh items for reopen %s", access.id)
        access.save()

    return JsonResponse({'ok': True, 'access': access.as_dict()})


@csrf_exempt
def supplier_access_bulk_generate(request):
    """Bulk-generate portal links for multiple suppliers at once."""
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    auth_err = _require_buyer_auth(request)
    if auth_err:
        return auth_err

    payload = _json_body(request) or {}
    pid = str(payload.get('project_id') or '')
    supplier_names = payload.get('supplier_names') or []

    if not pid or not supplier_names:
        return JsonResponse({'error': 'project_id and supplier_names required'}, status=400)

    try:
        proj = Project.objects.get(id=pid)
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)

    # Parse valid_until
    vu = None
    vu_raw = payload.get('valid_until')
    if vu_raw:
        from django.utils.dateparse import parse_datetime, parse_date
        vu = parse_datetime(str(vu_raw))
        if not vu:
            d = parse_date(str(vu_raw))
            if d:
                from datetime import datetime, time as dtime
                from django.utils import timezone
                vu = timezone.make_aware(datetime.combine(d, dtime(23, 59, 59)))

    contact_name = str(payload.get('contact_name') or '').strip()[:255]
    contact_email = str(payload.get('contact_email') or '').strip()[:255]
    contact_phone = str(payload.get('contact_phone') or '').strip()[:64]
    instruction_message = str(payload.get('instruction_message') or '').strip()

    results = []
    for sname in supplier_names:
        sname = str(sname).strip()
        if not sname:
            continue
        extracted = _extract_items_for_supplier(proj.data, sname)
        token = uuid.uuid4().hex
        access = SupplierAccess(
            id=token,
            project=proj,
            supplier_name=sname,
            requested_items=extracted,
            submission_data={},
            status='sent',
            round=1,
            valid_until=vu,
            contact_name=contact_name,
            contact_email=contact_email,
            contact_phone=contact_phone,
            instruction_message=instruction_message,
        )
        access.save()
        results.append(access.as_dict())

    return JsonResponse({'ok': True, 'accesses': results, 'count': len(results)})


# ============================================================================
# QUOTES API - Centrální databáze nabídek
# ============================================================================

@csrf_exempt
def quotes_list(request):
    """
    GET /api/quotes/
    List & filter quotes with optional parameters:
    - project_id: filter by project
    - supplier: filter by supplier name (case-insensitive partial match)
    - expired: 'true'/'false' to show only expired/active quotes
    - search: full-text search across quote_number, supplier_name, project_name
    - limit: pagination limit (default 100)
    - offset: pagination offset (default 0)
    """
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])

    auth_err = _require_buyer_auth(request)
    if auth_err:
        return auth_err

    from datetime import date
    from django.db.models import Q

    qs = Quote.objects.all()

    # Filters
    project_id = request.GET.get('project_id')
    if project_id:
        qs = qs.filter(project_id=project_id)

    supplier = request.GET.get('supplier', '').strip()
    if supplier:
        qs = qs.filter(supplier_name__icontains=supplier)

    expired_param = request.GET.get('expired', '').strip().lower()
    if expired_param == 'true':
        qs = qs.filter(expire_date__lt=date.today())
    elif expired_param == 'false':
        qs = qs.filter(expire_date__gte=date.today())

    search = request.GET.get('search', '').strip()
    if search:
        qs = qs.filter(
            Q(quote_number__icontains=search) |
            Q(supplier_name__icontains=search) |
            Q(project_name__icontains=search) |
            Q(received_from__icontains=search)
        )

    # Pagination
    try:
        limit = int(request.GET.get('limit', 100))
        offset = int(request.GET.get('offset', 0))
        limit = min(limit, 500)  # Max 500
    except (ValueError, TypeError):
        limit = 100
        offset = 0

    total = qs.count()
    quotes = qs[offset:offset + limit]

    return JsonResponse({
        'ok': True,
        'quotes': [q.as_dict() for q in quotes],
        'total': total,
        'limit': limit,
        'offset': offset,
    })


@csrf_exempt
def quotes_detail(request, quote_id):
    """
    GET /api/quotes/<quote_id>/
    Returns quote detail including all lines.
    """
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])

    auth_err = _require_buyer_auth(request)
    if auth_err:
        return auth_err

    try:
        quote = Quote.objects.get(id=quote_id)
    except Quote.DoesNotExist:
        return JsonResponse({'error': 'Quote not found'}, status=404)

    data = quote.as_dict()
    data['lines'] = [line.as_dict() for line in quote.lines.all()]

    return JsonResponse({'ok': True, 'quote': data})


@csrf_exempt
def quotes_create(request):
    """
    POST /api/quotes/
    Create new quote with lines.
    Body: {
        id: optional (auto-generated if missing),
        project_id: optional,
        supplier_name: required,
        expire_date: required (YYYY-MM-DD),
        expire_preset: optional (30/60/90/120/360),
        quote_number: optional (auto-generated if missing),
        currency, shipping_cost, incoterm, mov, extra_charge, payment_terms, packaging, notes,
        received_from, created_by,
        lines: [
            {drawing_number, manufacturer, mpn, moq, qty_1..10, price_1..10, ...}
        ]
    }
    """
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    auth_err = _require_buyer_auth(request)
    if auth_err:
        return auth_err

    try:
        data = json.loads(request.body.decode('utf-8'))
    except (ValueError, UnicodeDecodeError):
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    # Required fields
    supplier_name = data.get('supplier_name', '').strip()
    expire_date_str = data.get('expire_date', '').strip()

    if not supplier_name:
        return JsonResponse({'error': 'supplier_name is required'}, status=400)
    if not expire_date_str:
        return JsonResponse({'error': 'expire_date is required'}, status=400)

    from datetime import datetime, timedelta

    try:
        expire_date = datetime.strptime(expire_date_str, '%Y-%m-%d').date()
    except ValueError:
        # Try preset
        expire_preset = data.get('expire_preset')
        if expire_preset in [30, 60, 90, 120, 360]:
            expire_date = (datetime.now() + timedelta(days=expire_preset)).date()
        else:
            return JsonResponse({'error': 'Invalid expire_date format (use YYYY-MM-DD or expire_preset)'}, status=400)

    # Create Quote
    quote_id = data.get('id') or str(uuid.uuid4())
    project_id = data.get('project_id')

    with transaction.atomic():
        quote = Quote(
            id=quote_id,
            project_id=project_id if project_id else None,
            project_name=data.get('project_name', ''),
            supplier_name=supplier_name,
            received_from=data.get('received_from', ''),
            quote_number=data.get('quote_number', ''),  # Auto-generates in save() if empty
            expire_date=expire_date,
            expire_preset=data.get('expire_preset'),
            currency=data.get('currency', 'EUR'),
            shipping_cost=data.get('shipping_cost'),
            incoterm=data.get('incoterm', ''),
            mov=data.get('mov'),
            extra_charge=data.get('extra_charge'),
            payment_terms=data.get('payment_terms', ''),
            packaging=data.get('packaging', ''),
            notes=data.get('notes', ''),
            attachment_name=data.get('attachment_name', ''),
            created_by=data.get('created_by', _get_buyer_username(request)),
            source=data.get('source', 'manual'),
            source_id=data.get('source_id', ''),
        )
        quote.save()

        # Create lines
        lines_data = data.get('lines', [])
        for idx, line_data in enumerate(lines_data):
            line = QuoteLine(
                quote=quote,
                drawing_number=line_data.get('drawing_number', ''),
                manufacturer=line_data.get('manufacturer', ''),
                mpn=line_data.get('mpn', ''),
                description=line_data.get('description', ''),
                uom=line_data.get('uom', 'pcs'),
                moq=line_data.get('moq', 1),
                manufacturing_lead_time=line_data.get('manufacturing_lead_time', ''),
                supplier_lead_time=line_data.get('supplier_lead_time', '14 days'),
                available_stock=line_data.get('available_stock'),
                available_stock_date=line_data.get('available_stock_date'),
                line_number=idx + 1,
                notes=line_data.get('notes', ''),
            )
            # Dynamic qty/price tiers
            for i in range(1, 11):
                setattr(line, f'qty_{i}', line_data.get(f'qty_{i}', ''))
                setattr(line, f'price_{i}', line_data.get(f'price_{i}'))
            line.save()

    return JsonResponse({'ok': True, 'quote': quote.as_dict()}, status=201)


@csrf_exempt
def quotes_update(request, quote_id):
    """
    PUT /api/quotes/<quote_id>/
    Update existing quote and lines.
    Body structure same as quotes_create.
    """
    if request.method != 'PUT':
        return HttpResponseNotAllowed(['PUT'])

    auth_err = _require_buyer_auth(request)
    if auth_err:
        return auth_err

    try:
        quote = Quote.objects.get(id=quote_id)
    except Quote.DoesNotExist:
        return JsonResponse({'error': 'Quote not found'}, status=404)

    try:
        data = json.loads(request.body.decode('utf-8'))
    except (ValueError, UnicodeDecodeError):
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    from datetime import datetime

    with transaction.atomic():
        # Update Quote fields
        if 'supplier_name' in data:
            quote.supplier_name = data['supplier_name']
        if 'received_from' in data:
            quote.received_from = data['received_from']
        if 'quote_number' in data:
            quote.quote_number = data['quote_number']
        if 'expire_date' in data:
            try:
                quote.expire_date = datetime.strptime(data['expire_date'], '%Y-%m-%d').date()
            except ValueError:
                pass
        if 'expire_preset' in data:
            quote.expire_preset = data['expire_preset']
        if 'currency' in data:
            quote.currency = data['currency']
        if 'shipping_cost' in data:
            quote.shipping_cost = data['shipping_cost']
        if 'incoterm' in data:
            quote.incoterm = data['incoterm']
        if 'mov' in data:
            quote.mov = data['mov']
        if 'extra_charge' in data:
            quote.extra_charge = data['extra_charge']
        if 'payment_terms' in data:
            quote.payment_terms = data['payment_terms']
        if 'packaging' in data:
            quote.packaging = data['packaging']
        if 'notes' in data:
            quote.notes = data['notes']
        if 'project_id' in data:
            quote.project_id = data['project_id']
        if 'project_name' in data:
            quote.project_name = data['project_name']

        quote.save()

        # Update lines if provided
        if 'lines' in data:
            # Delete existing lines and recreate
            quote.lines.all().delete()
            for idx, line_data in enumerate(data['lines']):
                line = QuoteLine(
                    quote=quote,
                    drawing_number=line_data.get('drawing_number', ''),
                    manufacturer=line_data.get('manufacturer', ''),
                    mpn=line_data.get('mpn', ''),
                    description=line_data.get('description', ''),
                    uom=line_data.get('uom', 'pcs'),
                    moq=line_data.get('moq', 1),
                    manufacturing_lead_time=line_data.get('manufacturing_lead_time', ''),
                    supplier_lead_time=line_data.get('supplier_lead_time', '14 days'),
                    available_stock=line_data.get('available_stock'),
                    available_stock_date=line_data.get('available_stock_date'),
                    line_number=idx + 1,
                    notes=line_data.get('notes', ''),
                )
                for i in range(1, 11):
                    setattr(line, f'qty_{i}', line_data.get(f'qty_{i}', ''))
                    setattr(line, f'price_{i}', line_data.get(f'price_{i}'))
                line.save()

    return JsonResponse({'ok': True, 'quote': quote.as_dict()})


@csrf_exempt
def quotes_delete(request, quote_id):
    """
    DELETE /api/quotes/<quote_id>/
    Delete quote and all associated lines.
    """
    if request.method != 'DELETE':
        return HttpResponseNotAllowed(['DELETE'])

    auth_err = _require_buyer_auth(request)
    if auth_err:
        return auth_err

    try:
        quote = Quote.objects.get(id=quote_id)
    except Quote.DoesNotExist:
        return JsonResponse({'error': 'Quote not found'}, status=404)

    quote_number = quote.quote_number
    quote.delete()

    return JsonResponse({'ok': True, 'deleted': quote_number})
