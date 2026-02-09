from django.urls import path
from . import views
from . import views_api

urlpatterns = [
    path('', views.app, name='rfq_app'),
    path('bundle/<str:bundle_id>/', views.app, name='rfq_bundle_app'),

    # API
    path('api/health', views_api.health, name='api_health'),
    path('api/projects', views_api.projects_collection, name='api_projects_collection'),
    path('api/projects/bulk', views_api.projects_bulk, name='api_projects_bulk'),
    path('api/projects/reset', views_api.projects_reset, name='api_projects_reset'),
    path('api/projects/<str:project_id>', views_api.project_detail, name='api_project_detail'),
    path('api/projects/<str:project_id>/attachments', views_api.project_attachments, name='api_project_attachments'),
    path('api/projects/<str:project_id>/attachments/<str:attachment_id>', views_api.project_attachment_detail, name='api_project_attachment_detail'),
    path('api/export', views_api.export_data, name='api_export'),

    # Supplier Interaction API
    path('api/supplier_access/generate', views_api.supplier_access_generate, name='api_supplier_access_generate'),
    path('api/supplier_access/<str:token>/submit', views_api.supplier_portal_submit, name='api_supplier_portal_submit'),
    path('api/supplier_access/<str:token>/save_draft', views_api.supplier_portal_save_draft, name='api_supplier_portal_save_draft'),
    path('api/supplier_access/<str:token>/approve', views_api.supplier_access_approve, name='api_supplier_access_approve'),
    path('api/projects/<str:project_id>/supplier_access', views_api.project_supplier_access_list, name='api_project_supplier_access_list'),
    path('api/supplier_access/<str:token>/viewed', views_api.supplier_access_viewed, name='api_supplier_access_viewed'),
    path('api/supplier_access/<str:token>/reject', views_api.supplier_access_reject, name='api_supplier_access_reject'),
    path('api/supplier_access/<str:token>/request_reopen', views_api.supplier_access_request_reopen, name='api_supplier_access_request_reopen'),
    path('api/supplier_access/<str:token>/update_items', views_api.supplier_access_update_items, name='api_supplier_access_update_items'),
    path('api/supplier_access/<str:token>/cancel', views_api.supplier_access_cancel, name='api_supplier_access_cancel'),
    path('api/supplier_access/<str:token>/reopen', views_api.supplier_access_reopen_buyer, name='api_supplier_access_reopen_buyer'),
    path('api/supplier_access/bulk_generate', views_api.supplier_access_bulk_generate, name='api_supplier_access_bulk_generate'),
    path('api/supplier_interaction/file/<str:file_id>', views_api.supplier_interaction_file_download, name='api_supplier_interaction_file_download'),

    # Quotes API
    path('api/quotes/', views_api.quotes_list, name='api_quotes_list'),
    path('api/quotes/<str:quote_id>/', views_api.quotes_detail, name='api_quotes_detail'),
    path('api/quotes/<str:quote_id>/update/', views_api.quotes_update, name='api_quotes_update'),
    path('api/quotes/<str:quote_id>/delete/', views_api.quotes_delete, name='api_quotes_delete'),
    path('api/quotes/create/', views_api.quotes_create, name='api_quotes_create'),

    # Portal View
    path('portal/<str:token>/', views.portal, name='rfq_portal'),
]
