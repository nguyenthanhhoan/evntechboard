from django.contrib import admin
from .models import CadFile, CadEntity

@admin.register(CadFile)
class CadFileAdmin(admin.ModelAdmin):
    list_display = ('name', 'file_type', 'size', 'uploaded_at')
    list_filter = ('file_type', 'uploaded_at')
    search_fields = ('name',)
    readonly_fields = ('id', 'size', 'uploaded_at')

@admin.register(CadEntity)
class CadEntityAdmin(admin.ModelAdmin):
    list_display = ('entity_type', 'layer', 'cad_file', 'created_at')
    list_filter = ('entity_type', 'layer', 'created_at')
    search_fields = ('entity_type', 'layer')
    readonly_fields = ('id', 'created_at')
