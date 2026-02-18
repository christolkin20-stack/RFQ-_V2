from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings

from rfq.models import Company, UserCompanyProfile

User = get_user_model()


@override_settings(SECURE_SSL_REDIRECT=False)
class ApiSmokeTests(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name='Smoke Co', is_active=True)
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        UserCompanyProfile.objects.create(
            user=self.user, company=self.company, role='editor', is_active=True,
        )

    def test_health_ok(self):
        r = self.client.get('/api/health')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json().get('ok'), True)

    @override_settings(DEBUG=False, ALLOWED_HOSTS=['testserver'])
    def test_projects_requires_auth_in_production_mode(self):
        r = self.client.get('/api/projects')
        self.assertEqual(r.status_code, 401)
        self.assertIn('error', r.json())

    @override_settings(DEBUG=True, ALLOWED_HOSTS=['testserver'])
    def test_projects_allowed_in_debug_mode_with_auth(self):
        """DEBUG mode no longer bypasses auth — user must be logged in."""
        self.client.force_login(self.user)
        r = self.client.get('/api/projects')
        self.assertEqual(r.status_code, 200)
        self.assertIn('projects', r.json())

    @override_settings(DEBUG=True, ALLOWED_HOSTS=['testserver'])
    def test_projects_requires_auth_even_in_debug(self):
        """Auth is now required regardless of DEBUG mode."""
        r = self.client.get('/api/projects')
        self.assertEqual(r.status_code, 401)

    @override_settings(DEBUG=False, ALLOWED_HOSTS=['testserver'])
    def test_projects_post_requires_auth(self):
        r = self.client.post('/api/projects', data='{"name":"X"}', content_type='application/json')
        self.assertEqual(r.status_code, 401)
