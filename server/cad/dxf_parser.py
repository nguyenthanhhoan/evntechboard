import os
import uuid
import json
try:
    import ezdxf
    EZDXF_AVAILABLE = True
except ImportError:
    EZDXF_AVAILABLE = False

from .models import CadEntity


def parse_dxf_file(file_obj, cad_file):
    """
    Parse a DXF file and create CadEntity objects for each entity in the file.
    
    Args:
        file_obj: The uploaded file object
        cad_file: The CadFile model instance
        
    Returns:
        List of created CadEntity objects
    """
    if not EZDXF_AVAILABLE:
        raise ImportError("ezdxf library is required for DXF parsing but not installed")
    
    # Save the file to a temporary location to read it with ezdxf
    temp_path = f"/tmp/{uuid.uuid4()}.dxf"
    try:
        with open(temp_path, 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)
        
        # Read the DXF file
        doc = ezdxf.readfile(temp_path)
        msp = doc.modelspace()
        
        entities = []
        
        # Process entities by type
        for entity in msp:
            entity_type = entity.dxftype()
            layer = entity.dxf.layer
            
            # Extract properties based on entity type
            properties = extract_entity_properties(entity)
            
            # Create CadEntity
            cad_entity = CadEntity(
                cad_file=cad_file,
                entity_type=entity_type,
                layer=layer,
                properties=properties
            )
            cad_entity.save()
            entities.append(cad_entity)
        
        return entities
    
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)


def extract_entity_properties(entity):
    """
    Extract relevant properties from a DXF entity based on its type.
    
    Args:
        entity: The DXF entity object
        
    Returns:
        Dictionary of properties
    """
    entity_type = entity.dxftype()
    properties = {}
    
    # Common properties for all entities
    properties['handle'] = entity.dxf.handle
    
    # Extract color information
    if hasattr(entity.dxf, 'color'):
        properties['color'] = entity.dxf.color
    
    # Extract linetype if available
    if hasattr(entity.dxf, 'linetype'):
        properties['linetype'] = entity.dxf.linetype
    
    # Extract entity-specific properties
    if entity_type == 'LINE':
        properties['start'] = {
            'x': entity.dxf.start.x,
            'y': entity.dxf.start.y,
            'z': entity.dxf.start.z
        }
        properties['end'] = {
            'x': entity.dxf.end.x,
            'y': entity.dxf.end.y,
            'z': entity.dxf.end.z
        }
    
    elif entity_type == 'CIRCLE':
        properties['center'] = {
            'x': entity.dxf.center.x,
            'y': entity.dxf.center.y,
            'z': entity.dxf.center.z
        }
        properties['radius'] = entity.dxf.radius
    
    elif entity_type == 'ARC':
        properties['center'] = {
            'x': entity.dxf.center.x,
            'y': entity.dxf.center.y,
            'z': entity.dxf.center.z
        }
        properties['radius'] = entity.dxf.radius
        properties['start_angle'] = entity.dxf.start_angle
        properties['end_angle'] = entity.dxf.end_angle
    
    elif entity_type == 'TEXT':
        properties['text'] = entity.dxf.text
        properties['insert'] = {
            'x': entity.dxf.insert.x,
            'y': entity.dxf.insert.y,
            'z': entity.dxf.insert.z
        }
        if hasattr(entity.dxf, 'height'):
            properties['height'] = entity.dxf.height
        if hasattr(entity.dxf, 'rotation'):
            properties['rotation'] = entity.dxf.rotation
    
    elif entity_type == 'POLYLINE' or entity_type == 'LWPOLYLINE':
        try:
            points = []
            for vertex in entity.vertices():
                points.append({
                    'x': vertex.dxf.location.x,
                    'y': vertex.dxf.location.y,
                    'z': vertex.dxf.location.z
                })
            properties['points'] = points
            if hasattr(entity.dxf, 'closed'):
                properties['closed'] = entity.dxf.closed
        except:
            # For LWPOLYLINE
            try:
                points = []
                for point in entity.get_points():
                    points.append({
                        'x': point[0],
                        'y': point[1]
                    })
                properties['points'] = points
                if hasattr(entity.dxf, 'closed'):
                    properties['closed'] = entity.dxf.closed
            except:
                pass
    
    return properties
