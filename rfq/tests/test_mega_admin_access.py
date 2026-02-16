from django.contrib.auth import get_user_model
from django.test import TestCase

from rfq.models import Company, UserCompanyProfile


class MegaAdminAccessTests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.company = Company.objects.create(name='Test Co')

    def test_profile_superadmin_can_open_mega_admin(self):
        u = self.User.objects.create_user(username='profile_super', password='x')
        UserCompanyProfile.objects.create(
            user=u,
            company=None,
            role='superadmin',
            is_active=True,
            is_management=True,
        )
        self.client.login(username='profile_super', password='x')
        r = self.client.get('/mega-admin/', secure=True)
        self.assertEqual(r.status_code, 200)

    def test_non_superadmin_forbidden(self):
        u = self.User.objects.create_user(username='normal_user', password='x')
        UserCompanyProfile.objects.create(
            user=u,
            company=self.company,
            role='admin',
            is_active=True,
            is_management=False,
        )
        self.client.login(username='normal_user', password='x')
        r = self.client.get('/mega-admin/', secure=True)
        self.assertEqual(r.status_code, 403)
