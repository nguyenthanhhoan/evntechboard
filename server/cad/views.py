import os
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Count
from .models import CadFile, CadEntity
from .serializers import CadFileSerializer, CadEntitySerializer
from .dxf_parser import parse_dxf_file


class CadFileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        file_obj = request.data.get('file')
        
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check file extension
        file_name = file_obj.name
        _, extension = os.path.splitext(file_name)
        extension = extension.lower().replace('.', '')
        
        if extension not in ['dxf', 'dwg']:
            return Response({'error': 'Invalid file type. Only DXF and DWG files are supported.'},
                           status=status.HTTP_400_BAD_REQUEST)
        
        # Create the CAD file record
        cad_file = CadFile(
            name=file_name,
            file=file_obj,
            file_type=extension,
            size=file_obj.size
        )
        cad_file.save()
        
        # Parse the file and extract entities
        try:
            if extension == 'dxf':
                entities = parse_dxf_file(file_obj, cad_file)
                # Note: parse_dxf_file is expected to create and save CadEntity objects
                
            # For DWG, we would need a separate parser
            # elif extension == 'dwg':
            #     entities = parse_dwg_file(file_obj, cad_file)
            
            serializer = CadFileSerializer(cad_file)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            cad_file.delete()  # Clean up if parsing fails
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CurrentCadFileView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # Get the most recently uploaded CAD file
            cad_file = CadFile.objects.latest('uploaded_at')
            serializer = CadFileSerializer(cad_file)
            return Response(serializer.data)
        except CadFile.DoesNotExist:
            return Response({'detail': 'No CAD file found'}, status=status.HTTP_404_NOT_FOUND)


class CadEntitiesView(generics.ListAPIView):
    serializer_class = CadEntitySerializer
    
    def get_queryset(self):
        try:
            cad_file = CadFile.objects.latest('uploaded_at')
            return CadEntity.objects.filter(cad_file=cad_file)
        except CadFile.DoesNotExist:
            return CadEntity.objects.none()


class CadEntityDetailView(generics.RetrieveAPIView):
    queryset = CadEntity.objects.all()
    serializer_class = CadEntitySerializer


class CadLayersView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            cad_file = CadFile.objects.latest('uploaded_at')
            layers = CadEntity.objects.filter(cad_file=cad_file).values('layer').distinct()
            return Response([layer['layer'] for layer in layers])
        except CadFile.DoesNotExist:
            return Response([], status=status.HTTP_404_NOT_FOUND)


class CadEntitiesByLayerView(APIView):
    def get(self, request, name, *args, **kwargs):
        try:
            cad_file = CadFile.objects.latest('uploaded_at')
            entities = CadEntity.objects.filter(cad_file=cad_file, layer=name)
            serializer = CadEntitySerializer(entities, many=True)
            return Response(serializer.data)
        except CadFile.DoesNotExist:
            return Response({'detail': 'No CAD file found'}, status=status.HTTP_404_NOT_FOUND)
