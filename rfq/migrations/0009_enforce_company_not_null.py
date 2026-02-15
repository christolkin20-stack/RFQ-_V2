from django.db import migrations, models
import django.db.models.deletion


def fill_missing_company(apps, schema_editor):
    Company = apps.get_model('rfq', 'Company')
    Project = apps.get_model('rfq', 'Project')
    Attachment = apps.get_model('rfq', 'Attachment')
    SupplierAccess = apps.get_model('rfq', 'SupplierAccess')
    SupplierAccessRound = apps.get_model('rfq', 'SupplierAccessRound')
    SupplierInteractionFile = apps.get_model('rfq', 'SupplierInteractionFile')
    Quote = apps.get_model('rfq', 'Quote')

    default_company, _ = Company.objects.get_or_create(name='Default Company', defaults={'is_active': True})

    Project.objects.filter(company__isnull=True).update(company=default_company)

    for a in Attachment.objects.filter(company__isnull=True).select_related('project'):
        a.company_id = a.project.company_id if a.project_id else default_company.id
        a.save(update_fields=['company'])

    for s in SupplierAccess.objects.filter(company__isnull=True).select_related('project'):
        s.company_id = s.project.company_id if s.project_id else default_company.id
        s.save(update_fields=['company'])

    for r in SupplierAccessRound.objects.filter(company__isnull=True).select_related('supplier_access'):
        r.company_id = r.supplier_access.company_id if r.supplier_access_id else default_company.id
        r.save(update_fields=['company'])

    for f in SupplierInteractionFile.objects.filter(company__isnull=True).select_related('supplier_access'):
        f.company_id = f.supplier_access.company_id if f.supplier_access_id else default_company.id
        f.save(update_fields=['company'])

    for q in Quote.objects.filter(company__isnull=True).select_related('project'):
        q.company_id = q.project.company_id if q.project_id else default_company.id
        q.save(update_fields=['company'])


class Migration(migrations.Migration):

    dependencies = [
        ('rfq', '0008_backfill_company_and_profiles'),
    ]

    operations = [
        migrations.RunPython(fill_missing_company, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='attachment',
            name='company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attachments', to='rfq.company'),
        ),
        migrations.AlterField(
            model_name='project',
            name='company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='projects', to='rfq.company'),
        ),
        migrations.AlterField(
            model_name='quote',
            name='company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='quotes', to='rfq.company'),
        ),
        migrations.AlterField(
            model_name='supplieraccess',
            name='company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='supplier_accesses', to='rfq.company'),
        ),
        migrations.AlterField(
            model_name='supplieraccessround',
            name='company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='supplier_access_rounds', to='rfq.company'),
        ),
        migrations.AlterField(
            model_name='supplierinteractionfile',
            name='company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='supplier_interaction_files', to='rfq.company'),
        ),
    ]
