from django.contrib import admin
from .models import Project, Quote, QuoteLine


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'updated_at', 'created_at')
    search_fields = ('id', 'name')
    readonly_fields = ('created_at', 'updated_at')


class QuoteLineInline(admin.TabularInline):
    model = QuoteLine
    extra = 0
    fields = ('drawing_number', 'manufacturer', 'mpn', 'moq', 'qty_1', 'price_1', 'qty_2', 'price_2')
    readonly_fields = ()


@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ('quote_number', 'supplier_name', 'project_name', 'expire_date', 'create_date', 'source')
    list_filter = ('source', 'currency', 'expire_date')
    search_fields = ('quote_number', 'supplier_name', 'project_name', 'received_from')
    readonly_fields = ('create_date', 'updated_at')
    inlines = [QuoteLineInline]
    fieldsets = (
        ('Identifikace', {
            'fields': ('id', 'quote_number', 'project', 'project_name')
        }),
        ('Dodavatel', {
            'fields': ('supplier_name', 'received_from')
        }),
        ('Platnost', {
            'fields': ('create_date', 'expire_date', 'expire_preset')
        }),
        ('Quote údaje', {
            'fields': ('currency', 'shipping_cost', 'incoterm', 'mov', 'extra_charge', 'payment_terms', 'packaging')
        }),
        ('Poznámky & přílohy', {
            'fields': ('notes', 'attachment', 'attachment_name')
        }),
        ('Metadata', {
            'fields': ('source', 'source_id', 'created_by', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(QuoteLine)
class QuoteLineAdmin(admin.ModelAdmin):
    list_display = ('quote', 'drawing_number', 'manufacturer', 'mpn', 'moq', 'price_1', 'line_number')
    list_filter = ('quote__supplier_name',)
    search_fields = ('drawing_number', 'manufacturer', 'mpn', 'quote__quote_number')
    readonly_fields = ()
    fieldsets = (
        ('Quote', {
            'fields': ('quote', 'line_number')
        }),
        ('Item identifikace', {
            'fields': ('drawing_number', 'manufacturer', 'mpn', 'description', 'uom')
        }),
        ('Základní údaje', {
            'fields': ('moq', 'manufacturing_lead_time', 'supplier_lead_time')
        }),
        ('Sklad', {
            'fields': ('available_stock', 'available_stock_date'),
            'classes': ('collapse',)
        }),
        ('QTY/Price Tiers 1-5', {
            'fields': (
                ('qty_1', 'price_1'),
                ('qty_2', 'price_2'),
                ('qty_3', 'price_3'),
                ('qty_4', 'price_4'),
                ('qty_5', 'price_5'),
            )
        }),
        ('QTY/Price Tiers 6-10', {
            'fields': (
                ('qty_6', 'price_6'),
                ('qty_7', 'price_7'),
                ('qty_8', 'price_8'),
                ('qty_9', 'price_9'),
                ('qty_10', 'price_10'),
            ),
            'classes': ('collapse',)
        }),
        ('Poznámky', {
            'fields': ('notes',)
        }),
    )
