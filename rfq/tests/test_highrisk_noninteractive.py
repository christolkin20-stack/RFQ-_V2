import json

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings

from rfq.models import Company, Project, UserCompanyProfile


@override_settings(DEBUG=False, SECURE_SSL_REDIRECT=False, ALLOWED_HOSTS=['testserver'])
class HighRiskNonInteractiveChecks(TestCase):
    def setUp(self):
        self.company_a = Company.objects.create(name='C1')
        self.company_b = Company.objects.create(name='C2')

        User = get_user_model()
        self.viewer_a = User.objects.create_user(username='viewer_a', password='pw12345')
        self.admin_a = User.objects.create_user(username='admin_a', password='pw12345')
        self.admin_b = User.objects.create_user(username='admin_b', password='pw12345')
        # NOTE: profile superadmin but not Django is_superuser
        self.profile_super = User.objects.create_user(username='profile_super', password='pw12345')
        self.django_super = User.objects.create_user(username='django_super', password='pw12345', is_superuser=True, is_staff=True)

        UserCompanyProfile.objects.create(user=self.viewer_a, company=self.company_a, role='viewer', is_active=True)
        UserCompanyProfile.objects.create(user=self.admin_a, company=self.company_a, role='admin', is_active=True)
        UserCompanyProfile.objects.create(user=self.admin_b, company=self.company_b, role='admin', is_active=True)
        UserCompanyProfile.objects.create(user=self.profile_super, company=None, role='superadmin', is_active=True)
        UserCompanyProfile.objects.create(user=self.django_super, company=None, role='superadmin', is_active=True)

        self.project_a = Project.objects.create(id='p-a', company=self.company_a, name='A', data={'id': 'p-a', 'name': 'A', 'items': []})
        self.project_b = Project.objects.create(id='p-b', company=self.company_b, name='B', data={'id': 'p-b', 'name': 'B', 'items': []})

    def _origin(self):
        return {'HTTP_ORIGIN': 'http://testserver'}

    def test_viewer_cannot_mutate_projects_bulk(self):
        self.client.login(username='viewer_a', password='pw12345')
        payload = {'projects': [{'id': 'p-a', 'name': 'A viewer write attempt', 'items': []}]}
        r = self.client.post('/api/projects/bulk', data=json.dumps(payload), content_type='application/json', **self._origin())
        self.assertEqual(r.status_code, 403)

    def test_company_admin_cannot_force_unlock_other_company_lock(self):
        self.client.login(username='admin_b', password='pw12345')
        acquire = self.client.post('/api/locks/acquire', data=json.dumps({'resource_key': 'rk-1', 'project_id': 'p-b'}), content_type='application/json', **self._origin())
        self.assertEqual(acquire.status_code, 200)
        self.client.logout()

        self.client.login(username='admin_a', password='pw12345')
        force = self.client.post('/api/locks/force_unlock', data=json.dumps({'resource_key': 'rk-1'}), content_type='application/json', **self._origin())
        self.assertEqual(force.status_code, 200)
        self.assertEqual(force.json().get('forced'), False)

    def test_company_admin_can_force_unlock_own_company_lock(self):
        self.client.login(username='admin_a', password='pw12345')
        acquire = self.client.post('/api/locks/acquire', data=json.dumps({'resource_key': 'rk-2', 'project_id': 'p-a'}), content_type='application/json', **self._origin())
        self.assertEqual(acquire.status_code, 200)
        force = self.client.post('/api/locks/force_unlock', data=json.dumps({'resource_key': 'rk-2'}), content_type='application/json', **self._origin())
        self.assertEqual(force.status_code, 200)
        self.assertEqual(force.json().get('forced'), True)

    def test_mega_admin_route_denies_non_superuser_and_allows_django_superuser(self):
        self.client.login(username='admin_a', password='pw12345')
        denied = self.client.get('/mega-admin/', secure=True)
        self.assertEqual(denied.status_code, 403)
        self.client.logout()

        self.client.login(username='django_super', password='pw12345')
        allowed = self.client.get('/mega-admin/', secure=True)
        self.assertEqual(allowed.status_code, 200)

    def test_mega_admin_route_allows_profile_superadmin_without_django_superuser_flag(self):
        self.client.login(username='profile_super', password='pw12345')
        allowed = self.client.get('/mega-admin/', secure=True)
        self.assertEqual(allowed.status_code, 200)
