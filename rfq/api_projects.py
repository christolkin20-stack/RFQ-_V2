import uuid
from django.db import transaction
from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt

from .api_common import (
    require_buyer_auth,
    require_same_origin_for_unsafe,
    json_body,
)
from .models import Project, Attachment
from . import views_api as _v


def health(request):
    return JsonResponse({'ok': True})


@csrf_exempt
def projects_collection(request):
    auth_err = require_buyer_auth(request)
    if auth_err:
        return auth_err

    csrf_err = require_same_origin_for_unsafe(request)
    if csrf_err:
        return csrf_err

    if request.method == 'GET':
        projects = [p.as_dict() for p in Project.objects.all()]
        return JsonResponse({'projects': projects})

    if request.method == 'POST':
        payload = json_body(request)
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
    auth_err = require_buyer_auth(request)
    if auth_err:
        return auth_err

    csrf_err = require_same_origin_for_unsafe(request)
    if csrf_err:
        return csrf_err

    pid = str(project_id)

    if request.method == 'GET':
        try:
            obj = Project.objects.get(id=pid)
        except Project.DoesNotExist:
            return JsonResponse({'error': 'Not found'}, status=404)
        return JsonResponse({'project': obj.as_dict()})

    if request.method in ('PUT', 'PATCH'):
        payload = json_body(request)
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
    auth_err = require_buyer_auth(request)
    if auth_err:
        return auth_err

    csrf_err = require_same_origin_for_unsafe(request)
    if csrf_err:
        return csrf_err

    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    payload = json_body(request)
    projects = None
    if isinstance(payload, dict) and isinstance(payload.get('projects'), list):
        projects = payload.get('projects')
    elif isinstance(payload, list):
        projects = payload

    if not isinstance(projects, list):
        body_len = len(request.body) if request.body else 0
        return JsonResponse({'error': f'Invalid payload (expected {{projects:[...]}}), got {type(payload).__name__}, body_len={body_len}'}, status=400)

    upserted = 0
    deleted = 0
    incoming_ids = set()

    with transaction.atomic():
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

        existing_ids = set(Project.objects.values_list('id', flat=True))
        ids_to_delete = existing_ids - incoming_ids
        if ids_to_delete:
            deleted = Project.objects.filter(id__in=ids_to_delete).delete()[0]

    return JsonResponse({'ok': True, 'upserted': upserted, 'deleted': deleted})


@csrf_exempt
def projects_reset(request):
    auth_err = require_buyer_auth(request)
    if auth_err:
        return auth_err

    csrf_err = require_same_origin_for_unsafe(request)
    if csrf_err:
        return csrf_err

    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    Project.objects.all().delete()
    return JsonResponse({'ok': True})


@csrf_exempt
def project_attachments(request, project_id: str):
    auth_err = require_buyer_auth(request)
    if auth_err:
        return auth_err

    csrf_err = require_same_origin_for_unsafe(request)
    if csrf_err:
        return csrf_err

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
    auth_err = require_buyer_auth(request)
    if auth_err:
        return auth_err

    csrf_err = require_same_origin_for_unsafe(request)
    if csrf_err:
        return csrf_err

    try:
        att = Attachment.objects.get(id=str(attachment_id), project_id=str(project_id))
    except Attachment.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    if request.method == 'DELETE':
        try:
            if att.file:
                att.file.delete(save=False)
        except Exception:
            pass
        att.delete()
        return JsonResponse({'ok': True})

    return HttpResponseNotAllowed(['DELETE'])


# bridge until export module extraction
export_data = _v.export_data
