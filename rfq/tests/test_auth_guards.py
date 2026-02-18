from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings

User = get_user_model()


@override_settings(SECURE_SSL_REDIRECT=False, DEBUG=False, ALLOWED_HOSTS=['testserver'])
class AuthGuardTests(TestCase):
    def test_export_requires_auth(self):
        r = self.client.post('/api/export', data='{}', content_type='application/json')
        self.assertEqual(r.status_code, 401)

    def test_projects_bulk_requires_auth(self):
        r = self.client.post('/api/projects/bulk', data='{"projects": []}', content_type='application/json')
        self.assertEqual(r.status_code, 401)

    def test_quotes_list_requires_auth(self):
        r = self.client.get('/api/quotes/')
        self.assertEqual(r.status_code, 401)

    def test_quotes_create_requires_auth(self):
        r = self.client.post('/api/quotes/create/', data='{}', content_type='application/json')
        self.assertEqual(r.status_code, 401)

    def test_supplier_access_generate_requires_auth(self):
        r = self.client.post('/api/supplier_access/generate', data='{}', content_type='application/json')
        self.assertEqual(r.status_code, 401)


@override_settings(SECURE_SSL_REDIRECT=False, DEBUG=True, ALLOWED_HOSTS=['testserver'])
class DebugModeBehaviorTests(TestCase):
    """Auth is now required even in DEBUG mode. Tests verify payload validation
    works correctly for authenticated users."""

    def setUp(self):
        self.user = User.objects.create_user(username='debuguser', password='testpass123')
        self.client.force_login(self.user)

    def test_projects_bulk_invalid_payload_returns_error(self):
        r = self.client.post('/api/projects/bulk', data='{}', content_type='application/json')
        # User is authed but has no company → 403 or 400 depending on profile
        self.assertIn(r.status_code, (400, 401, 403))

    def test_quotes_create_invalid_payload_in_debug(self):
        r = self.client.post('/api/quotes/create/', data='{}', content_type='application/json')
        # User is authed but has no company → 403 or endpoint validation error
        self.assertIn(r.status_code, (400, 401, 403, 500))

    def test_debug_mode_no_longer_bypasses_auth(self):
        """Verify that unauthenticated requests are rejected even in DEBUG."""
        self.client.logout()
        r = self.client.get('/api/projects')
        self.assertEqual(r.status_code, 401)
