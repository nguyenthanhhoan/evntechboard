from rest_framework import serializers
from .models import CadFile, CadEntity


class CadEntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CadEntity
        fields = ['id', 'entity_type', 'layer', 'properties']


class CadFileSerializer(serializers.ModelSerializer):
    entities = CadEntitySerializer(many=True, read_only=True)
    
    class Meta:
        model = CadFile
        fields = ['id', 'name', 'file', 'file_type', 'size', 'uploaded_at', 'entities']
        read_only_fields = ['id', 'size', 'uploaded_at']

