import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const CADCanvas = ({ file, onEntitySelect }) => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const entitiesRef = useRef({});
  
  const [zoom, setZoom] = useState(1);
  const [selectedTool, setSelectedTool] = useState('pan'); // pan, select, measure
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [viewOptions, setViewOptions] = useState({
    showGrid: true,
    showAxes: true,
    darkMode: false
  });
  
  // Initialize the scene
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;
    cameraRef.current = camera;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setClearColor(0xf0f0f0, 1);
    rendererRef.current = renderer;
    
    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = true;
    controlsRef.current = controls;
    
    // Add grid
    addGrid();
    
    // Add axes
    addAxes();
    
    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      // Clear scene
      if (sceneRef.current) {
        while (sceneRef.current.children.length > 0) {
          const child = sceneRef.current.children[0];
          sceneRef.current.remove(child);
        }
      }
    };
  }, []);
  
  // Add grid to the scene
  const addGrid = () => {
    if (!sceneRef.current) return;
    
    const grid = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
    grid.name = 'grid';
    sceneRef.current.add(grid);
  };
  
  // Add axes to the scene
  const addAxes = () => {
    if (!sceneRef.current) return;
    
    const axes = new THREE.AxesHelper(5);
    axes.name = 'axes';
    sceneRef.current.add(axes);
  };
  
  // Handle CAD file data change
  useEffect(() => {
    if (!file || !sceneRef.current) return;
    
    // Clear previous entities
    clearEntities();
    
    // Process and display entities from the CAD file
    if (file.entities && file.entities.length > 0) {
      processEntities(file.entities);
    }
  }, [file]);
  
  // Clear all entities from the scene
  const clearEntities = () => {
    if (!sceneRef.current) return;
    
    // Remove entities but keep grid and axes
    const toRemove = [];
    sceneRef.current.children.forEach(child => {
      if (child.name !== 'grid' && child.name !== 'axes') {
        toRemove.push(child);
      }
    });
    
    toRemove.forEach(child => {
      sceneRef.current.remove(child);
    });
    
    // Clear entities reference
    entitiesRef.current = {};
  };
  
  // Process CAD entities and add them to the scene
  const processEntities = (entities) => {
    if (!sceneRef.current) return;
    
    entities.forEach(entity => {
      const mesh = createEntityMesh(entity);
      if (mesh) {
        mesh.userData.entity = entity;
        sceneRef.current.add(mesh);
        entitiesRef.current[entity.id] = mesh;
      }
    });
    
    // Center camera on the entities
    centerCamera();
  };
  
  // Create a mesh for a CAD entity based on its type
  const createEntityMesh = (entity) => {
    const entityType = entity.entity_type || entity.type;
    const color = getEntityColor(entity);
    
    if (entityType === 'LINE') {
      return createLineMesh(entity, color);
    } else if (entityType === 'CIRCLE') {
      return createCircleMesh(entity, color);
    } else if (entityType === 'ARC') {
      return createArcMesh(entity, color);
    } else if (entityType === 'TEXT') {
      return createTextMesh(entity, color);
    } else if (entityType === 'POLYLINE' || entityType === 'LWPOLYLINE') {
      return createPolylineMesh(entity, color);
    }
    
    return null;
  };
  
  // Create a mesh for a LINE entity
  const createLineMesh = (entity, color) => {
    const props = entity.properties;
    if (!props || !props.start || !props.end) return null;
    
    const points = [
      new THREE.Vector3(props.start.x, props.start.y, props.start.z || 0),
      new THREE.Vector3(props.end.x, props.end.y, props.end.z || 0)
    ];
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color });
    
    const line = new THREE.Line(geometry, material);
    line.name = `entity-${entity.id}`;
    
    return line;
  };
  
  // Create a mesh for a CIRCLE entity
  const createCircleMesh = (entity, color) => {
    const props = entity.properties;
    if (!props || !props.center || !props.radius) return null;
    
    const geometry = new THREE.CircleGeometry(props.radius, 32);
    const material = new THREE.LineBasicMaterial({ color });
    
    // Convert to line segments (outline only)
    const points = [];
    geometry.vertices.forEach(vertex => {
      points.push(vertex);
    });
    points.push(points[0]); // Close the circle
    
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const circle = new THREE.Line(lineGeometry, material);
    
    circle.position.set(props.center.x, props.center.y, props.center.z || 0);
    circle.name = `entity-${entity.id}`;
    
    return circle;
  };
  
  // Create a mesh for an ARC entity
  const createArcMesh = (entity, color) => {
    const props = entity.properties;
    if (!props || !props.center || !props.radius || !props.start_angle || !props.end_angle) return null;
    
    const curve = new THREE.EllipseCurve(
      props.center.x, props.center.y,
      props.radius, props.radius,
      props.start_angle * Math.PI / 180, props.end_angle * Math.PI / 180,
      false, // clockwise
      0 // rotation
    );
    
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color });
    
    const arc = new THREE.Line(geometry, material);
    arc.position.z = props.center.z || 0;
    arc.name = `entity-${entity.id}`;
    
    return arc;
  };
  
  // Create a mesh for a TEXT entity
  const createTextMesh = (entity, color) => {
    // Text requires a canvas-based approach or a text sprite library
    // For simplicity, we'll just create a point to represent text for now
    const props = entity.properties;
    if (!props || !props.insert) return null;
    
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color });
    
    const text = new THREE.Mesh(geometry, material);
    text.position.set(props.insert.x, props.insert.y, props.insert.z || 0);
    text.name = `entity-${entity.id}`;
    
    return text;
  };
  
  // Create a mesh for a POLYLINE entity
  const createPolylineMesh = (entity, color) => {
    const props = entity.properties;
    if (!props || !props.points || !props.points.length) return null;
    
    const points = props.points.map(point => {
      return new THREE.Vector3(point.x, point.y, point.z || 0);
    });
    
    // If the polyline is closed, add the first point again
    if (props.closed && points.length > 2) {
      points.push(points[0]);
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color });
    
    const polyline = new THREE.Line(geometry, material);
    polyline.name = `entity-${entity.id}`;
    
    return polyline;
  };
  
  // Get a color for an entity based on its layer or properties
  const getEntityColor = (entity) => {
    // Use entity's color if defined
    if (entity.properties && entity.properties.color) {
      return new THREE.Color(entity.properties.color);
    }
    
    // Otherwise use a color based on layer
    const layer = entity.layer || 'default';
    
    // Generate a hash from the layer name for consistent colors
    let hash = 0;
    for (let i = 0; i < layer.length; i++) {
      hash = layer.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert to RGB
    const r = (hash & 0xFF) / 255;
    const g = ((hash >> 8) & 0xFF) / 255;
    const b = ((hash >> 16) & 0xFF) / 255;
    
    return new THREE.Color(r, g, b);
  };
  
  // Center the camera on the entities
  const centerCamera = () => {
    if (!sceneRef.current || !cameraRef.current || !controlsRef.current) return;
    
    // Get all entity objects
    const entities = Object.values(entitiesRef.current);
    if (entities.length === 0) return;
    
    // Calculate the bounding box
    const box = new THREE.Box3();
    entities.forEach(entity => {
      entity.geometry.computeBoundingBox();
      box.expandByObject(entity);
    });
    
    // Get the center and size of the bounding box
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    const size = new THREE.Vector3();
    box.getSize(size);
    
    // Calculate the distance needed to fit all entities in view
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = cameraRef.current.fov * (Math.PI / 180);
    let distance = maxDim / (2 * Math.tan(fov / 2));
    
    // Add some padding
    distance *= 1.5;
    
    // Set camera position
    cameraRef.current.position.copy(center);
    cameraRef.current.position.z = distance;
    
    // Set controls target to center
    controlsRef.current.target.copy(center);
    controlsRef.current.update();
  };
  
  // Handle tool selection
  const handleToolChange = (tool) => {
    setSelectedTool(tool);
    
    if (tool === 'pan') {
      if (controlsRef.current) {
        controlsRef.current.enableRotate = true;
        controlsRef.current.enablePan = true;
        controlsRef.current.enableZoom = true;
      }
    } else if (tool === 'select') {
      if (controlsRef.current) {
        controlsRef.current.enableRotate = false;
        controlsRef.current.enablePan = false;
        controlsRef.current.enableZoom = true;
      }
    }
  };
  
  // Handle zoom change
  const handleZoomChange = (newZoom) => {
    setZoom(newZoom);
    
    if (cameraRef.current) {
      cameraRef.current.zoom = newZoom;
      cameraRef.current.updateProjectionMatrix();
    }
  };
  
  // Handle view option toggle
  const handleToggleOption = (option) => {
    setViewOptions(prev => {
      const newOptions = { ...prev, [option]: !prev[option] };
      
      // Update scene based on options
      if (option === 'showGrid') {
        const grid = sceneRef.current.getObjectByName('grid');
        if (grid) {
          grid.visible = newOptions.showGrid;
        }
      } else if (option === 'showAxes') {
        const axes = sceneRef.current.getObjectByName('axes');
        if (axes) {
          axes.visible = newOptions.showAxes;
        }
      } else if (option === 'darkMode') {
        if (rendererRef.current) {
          rendererRef.current.setClearColor(newOptions.darkMode ? 0x222222 : 0xf0f0f0, 1);
        }
      }
      
      return newOptions;
    });
  };
  
  // Handle layer selection
  const handleLayerChange = (layer) => {
    setSelectedLayer(layer);
    
    // Show/hide entities based on selected layer
    Object.values(entitiesRef.current).forEach(mesh => {
      const entityLayer = mesh.userData.entity.layer;
      mesh.visible = (layer === 'all' || entityLayer === layer);
    });
  };
  
  // Handle canvas click
  const handleCanvasClick = (event) => {
    if (selectedTool !== 'select' || !canvasRef.current) return;
    
    // Get mouse position
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Raycasting to select entity
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
    
    const intersects = raycaster.intersectObjects(Object.values(entitiesRef.current));
    
    if (intersects.length > 0) {
      const selectedMesh = intersects[0].object;
      const selectedEntity = selectedMesh.userData.entity;
      
      // Call the selection handler
      if (onEntitySelect) {
        onEntitySelect(selectedEntity);
      }
      
      // Highlight the selected entity
      highlightEntity(selectedEntity.id);
    }
  };
  
  // Highlight an entity
  const highlightEntity = (entityId) => {
    // Reset all entity materials
    Object.values(entitiesRef.current).forEach(mesh => {
      mesh.material.color.set(getEntityColor(mesh.userData.entity));
      mesh.material.linewidth = 1;
    });
    
    // Highlight the selected entity
    const selectedMesh = entitiesRef.current[entityId];
    if (selectedMesh) {
      selectedMesh.material.color.set(0xff9900);
      selectedMesh.material.linewidth = 2;
    }
  };
  
  return (
    <div className="cad-canvas-container h-full relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        onClick={handleCanvasClick}
      />
      
      <div className="absolute top-4 left-4 bg-white p-2 shadow rounded-lg flex items-center space-x-2">
        <button
          className={`p-2 rounded ${selectedTool === 'pan' ? 'bg-primary text-white' : 'hover:bg-neutral-bg'}`}
          onClick={() => handleToolChange('pan')}
          title="Pan Tool"
        >
          <i className="ri-drag-move-line"></i>
        </button>
        <button
          className={`p-2 rounded ${selectedTool === 'select' ? 'bg-primary text-white' : 'hover:bg-neutral-bg'}`}
          onClick={() => handleToolChange('select')}
          title="Select Tool"
        >
          <i className="ri-cursor-line"></i>
        </button>
        <div className="h-4 border-l border-neutral-light mx-1"></div>
        <button
          className={`p-2 rounded ${viewOptions.showGrid ? 'text-primary' : 'text-neutral-medium'}`}
          onClick={() => handleToggleOption('showGrid')}
          title="Toggle Grid"
        >
          <i className="ri-grid-line"></i>
        </button>
        <button
          className={`p-2 rounded ${viewOptions.showAxes ? 'text-primary' : 'text-neutral-medium'}`}
          onClick={() => handleToggleOption('showAxes')}
          title="Toggle Axes"
        >
          <i className="ri-focus-3-line"></i>
        </button>
        <button
          className={`p-2 rounded ${viewOptions.darkMode ? 'text-primary' : 'text-neutral-medium'}`}
          onClick={() => handleToggleOption('darkMode')}
          title="Toggle Dark Mode"
        >
          <i className={viewOptions.darkMode ? "ri-moon-fill" : "ri-moon-line"}></i>
        </button>
      </div>
      
      <div className="absolute bottom-4 right-4 bg-white p-2 shadow rounded-lg flex items-center space-x-2">
        <button
          className="p-2 rounded hover:bg-neutral-bg"
          onClick={() => handleZoomChange(zoom - 0.1)}
          title="Zoom Out"
        >
          <i className="ri-subtract-line"></i>
        </button>
        <span className="text-sm">{Math.round(zoom * 100)}%</span>
        <button
          className="p-2 rounded hover:bg-neutral-bg"
          onClick={() => handleZoomChange(zoom + 0.1)}
          title="Zoom In"
        >
          <i className="ri-add-line"></i>
        </button>
        <div className="h-4 border-l border-neutral-light mx-1"></div>
        <button
          className="p-2 rounded hover:bg-neutral-bg"
          onClick={centerCamera}
          title="Fit to View"
        >
          <i className="ri-fullscreen-line"></i>
        </button>
      </div>
    </div>
  );
};

export default CADCanvas;