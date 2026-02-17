import json
from datetime import timedelta, date
from pathlib import Path

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.utils import timezone

from rfq.models import Company, EditLock, Project, Quote, UserCompanyProfile


@override_settings(DEBUG=False, SECURE_SSL_REDIRECT=False, ALLOWED_HOSTS=['testserver'])
class UrgentAuditRegressionTests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.company_a = Company.objects.create(name='Comp A')
        self.company_b = Company.objects.create(name='Comp B')

        self.admin_a = self.User.objects.create_user(username='admin_a', password='pw12345')
        self.editor_a = self.User.objects.create_user(username='editor_a', password='pw12345')
        self.admin_b = self.User.objects.create_user(username='admin_b', password='pw12345')
        self.superadmin = self.User.objects.create_user(username='super', password='pw12345')

        UserCompanyProfile.objects.create(user=self.admin_a, company=self.company_a, role='admin', is_active=True)
        UserCompanyProfile.objects.create(user=self.editor_a, company=self.company_a, role='editor', is_active=True)
        UserCompanyProfile.objects.create(user=self.admin_b, company=self.company_b, role='admin', is_active=True)
        UserCompanyProfile.objects.create(user=self.superadmin, company=None, role='superadmin', is_active=True)

        self.project_a = Project.objects.create(id='proj-a', company=self.company_a, name='A', data={'id': 'proj-a', 'name': 'A'})
        self.project_b = Project.objects.create(id='proj-b', company=self.company_b, name='B', data={'id': 'proj-b', 'name': 'B'})
        Quote.objects.create(
            id='q-a', company=self.company_a, project=self.project_a, supplier_name='Supp A',
            quote_number='QA-001', expire_date=date(2030, 1, 1), currency='EUR'
        )
        Quote.objects.create(
            id='q-b', company=self.company_b, project=self.project_b, supplier_name='Supp B',
            quote_number='QB-001', expire_date=date(2030, 1, 1), currency='EUR'
        )

    def _origin(self):
        return {'HTTP_ORIGIN': 'http://testserver'}

    def test_superadmin_switch_company_persists_and_scopes_reads_writes(self):
        self.client.login(username='super', password='pw12345')

        # no explicit scope in fresh session
        me0 = self.client.get('/api/session/me', **self._origin())
        self.assertEqual(me0.status_code, 200)
        self.assertIsNone(me0.json().get('scope_company_id'))

        # set explicit company scope
        rs = self.client.post('/api/session/switch_company', data=json.dumps({'company_id': self.company_a.id}), content_type='application/json', **self._origin())
        self.assertEqual(rs.status_code, 200)

        # persisted session scope reflected after "reload" (new request)
        me1 = self.client.get('/api/session/me', **self._origin())
        self.assertEqual(me1.status_code, 200)
        self.assertEqual(me1.json().get('scope_company_id'), self.company_a.id)

        # list read scope follows selected company only
        rp = self.client.get('/api/projects', **self._origin())
        self.assertEqual(rp.status_code, 200)
        ids = {p['id'] for p in rp.json().get('projects', [])}
        self.assertEqual(ids, {'proj-a'})

        # write scope pinned to selected company
        payload = {'projects': [{'id': 'proj-a', 'name': 'A+1', 'items': []}]}
        wb = self.client.post('/api/projects/bulk', data=json.dumps(payload), content_type='application/json', **self._origin())
        self.assertEqual(wb.status_code, 200)
        self.project_a.refresh_from_db()
        self.assertEqual(self.project_a.name, 'A+1')

    def test_admin_editor_are_company_isolated_for_list_and_detail(self):
        self.client.login(username='admin_a', password='pw12345')

        r_list = self.client.get('/api/projects', **self._origin())
        self.assertEqual(r_list.status_code, 200)
        ids = {p['id'] for p in r_list.json().get('projects', [])}
        self.assertEqual(ids, {'proj-a'})

        r_detail = self.client.get('/api/projects/proj-b', **self._origin())
        self.assertEqual(r_detail.status_code, 404)

        r_quotes = self.client.get('/api/quotes/', **self._origin())
        self.assertEqual(r_quotes.status_code, 200)
        quote_ids = {q['id'] for q in r_quotes.json().get('quotes', [])}
        self.assertEqual(quote_ids, {'q-a'})

        self.client.logout()
        self.client.login(username='editor_a', password='pw12345')
        r_editor_detail = self.client.get('/api/projects/proj-b', **self._origin())
        self.assertEqual(r_editor_detail.status_code, 404)

    def test_lock_status_owner_display_falls_back_to_username(self):
        self.client.login(username='admin_a', password='pw12345')
        EditLock.objects.create(
            resource_key='item:proj-a:it-1',
            company=self.company_a,
            project=self.project_a,
            locked_by=self.admin_a,
            locked_by_display='',
            context='item_detail',
            expires_at=timezone.now() + timedelta(minutes=10),
        )

        r = self.client.get('/api/locks/status?resource_key=item:proj-a:it-1', **self._origin())
        self.assertEqual(r.status_code, 200)
        body = r.json()
        self.assertTrue(body.get('locked'))
        self.assertEqual((body.get('owner') or {}).get('display'), 'admin_a')

    def test_ai_assistant_removed_from_main_nav_bundle(self):
        js = Path('rfq/static/rfq/rfq.js').read_text(encoding='utf-8')
        self.assertNotIn('nav-ai-chat', js)
        self.assertNotIn('AI Chat Bot Integration', js)
