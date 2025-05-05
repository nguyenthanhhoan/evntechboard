from django.db import models
import uuid


class CadFile(models.Model):
    """Model representing a CAD file."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='cad_files/')
    file_type = models.CharField(max_length=10)  # DXF, DWG, etc.
    size = models.PositiveIntegerField()  # Size in bytes
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class CadEntity(models.Model):
    """Model representing a CAD entity within a file."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cad_file = models.ForeignKey(CadFile, related_name='entities', on_delete=models.CASCADE)
    entity_type = models.CharField(max_length=50)  # LINE, CIRCLE, TEXT, etc.
    layer = models.CharField(max_length=255)
    properties = models.JSONField()  # Store entity-specific properties
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.entity_type} on {self.layer}"
