import json
import logging
from urllib.parse import urlparse

from django.conf import settings as django_settings
from django.http import JsonResponse

logger = logging.getLogger(__name__)


def require_buyer_auth(request):
    """
    Return a 401 JsonResponse if request is not authenticated in production.
    In DEBUG mode, allow unauthenticated access (single-user/local dev).
    """
    if request.user.is_authenticated:
        return None
    if getattr(django_settings, 'DEBUG', False):
        return None
    return JsonResponse({'error': 'Authentication required'}, status=401)


def require_same_origin_for_unsafe(request):
    """Extra CSRF mitigation for csrf_exempt API endpoints in production."""
    if request.method in ('GET', 'HEAD', 'OPTIONS'):
        return None
    if getattr(django_settings, 'DEBUG', False):
        return None

    src = request.META.get('HTTP_ORIGIN') or request.META.get('HTTP_REFERER')
    if not src:
        return JsonResponse({'error': 'Missing origin/referrer'}, status=403)

    try:
        host = (urlparse(src).netloc or '').lower()
    except Exception:
        return JsonResponse({'error': 'Invalid origin/referrer'}, status=403)

    allowed_hosts = {h.lower() for h in getattr(django_settings, 'ALLOWED_HOSTS', []) if h and h != '*'}
    trusted = set()
    for o in getattr(django_settings, 'CSRF_TRUSTED_ORIGINS', []) or []:
        try:
            trusted.add((urlparse(o).netloc or '').lower())
        except Exception:
            pass

    if host not in allowed_hosts and host not in trusted:
        return JsonResponse({'error': 'Origin not allowed'}, status=403)
    return None


def get_buyer_username(request):
    if request.user.is_authenticated:
        return request.user.username
    return 'admin'


def json_body(request):
    try:
        raw = request.body.decode('utf-8') if request.body else ''
        if not raw:
            return None
        return json.loads(raw)
    except Exception as e:
        logger.warning('[RFQ API] JSON parse error: %s (body_len=%s)', e, len(request.body) if request.body else 0)
        return None
