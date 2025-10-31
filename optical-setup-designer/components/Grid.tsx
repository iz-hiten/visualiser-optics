import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { OpticalComponentData, Position, ComponentType, RaySegment } from '../types';
import OpticalComponent from './OpticalComponent';
import { calculateRayPath } from '../services/rayTracer';

interface GridProps {
  components: OpticalComponentData[];
  selectedComponentId: string | null;
  onAddComponent: (type: ComponentType, position: Position) => void;
  onUpdateComponent: (id: string, updates: Partial<OpticalComponentData>) => void;
  onSelectComponent: (id: string | null) => void;
  view: { pan: Position, zoom: number };
  setView: React.Dispatch<React.SetStateAction<{ pan: Position, zoom: number }>>;
}

const Grid: React.FC<GridProps> = ({ components, selectedComponentId, onAddComponent, onUpdateComponent, onSelectComponent, view, setView }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingComponent, setDraggingComponent] = useState<{ id: string, startPos: Position, dragOffset: Position } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  
  const [targetRayPath, setTargetRayPath] = useState<RaySegment[]>([]);
  const [animatedRayPath, setAnimatedRayPath] = useState<RaySegment[]>([]);
  const animationTimeouts = useRef<number[]>([]);

  useEffect(() => {
    const newPath = calculateRayPath(components);
    setTargetRayPath(newPath);
  }, [components]);

  useEffect(() => {
    animationTimeouts.current.forEach(clearTimeout);
    animationTimeouts.current = [];
    setAnimatedRayPath([]);

    targetRayPath.forEach((segment, index) => {
      const timeoutId = window.setTimeout(() => {
        setAnimatedRayPath(prev => [...prev, segment]);
      }, index * 20);
      animationTimeouts.current.push(timeoutId);
    });

    return () => animationTimeouts.current.forEach(clearTimeout);
  }, [targetRayPath]);

  const screenToWorld = useCallback((screenX: number, screenY: number): Position => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const x = (screenX - rect.left - view.pan.x) / view.zoom;
    const y = (screenY - rect.top - view.pan.y) / view.zoom;
    return { x, y };
  }, [view]);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button === 1) { // Middle mouse button
      setIsPanning(true);
      e.currentTarget.style.cursor = 'grabbing';
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isPanning) {
      setView(v => ({ ...v, pan: { x: v.pan.x + e.movementX, y: v.pan.y + e.movementY }}));
    } else if (draggingComponent) {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      const newPosition = { 
          x: worldPos.x - draggingComponent.dragOffset.x, 
          y: worldPos.y - draggingComponent.dragOffset.y 
      };
      onUpdateComponent(draggingComponent.id, { position: newPosition });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isPanning) {
        setIsPanning(false);
        e.currentTarget.style.cursor = 'default';
    }
    if(draggingComponent) {
        setDraggingComponent(null);
    }
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    if (!svgRef.current) return;
    const scroll = e.deltaY * -0.005;
    const newZoom = Math.max(5, Math.min(200, view.zoom * (1 + scroll)));

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newPanX = mouseX - (mouseX - view.pan.x) * (newZoom / view.zoom);
    const newPanY = mouseY - (mouseY - view.pan.y) * (newZoom / view.zoom);
    
    setView({ zoom: newZoom, pan: { x: newPanX, y: newPanY } });
  };

  const handleComponentPointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    if (e.button !== 0) return; // Only allow left-click drag
    onSelectComponent(id);
    const component = components.find(c => c.id === id);
    if(component) {
        const worldPos = screenToWorld(e.clientX, e.clientY);
        setDraggingComponent({
            id,
            startPos: component.position,
            dragOffset: { x: worldPos.x - component.position.x, y: worldPos.y - component.position.y }
        });
    }
  };

  const handleComponentWheel = (e: React.WheelEvent, id: string) => {
      e.stopPropagation();
      if (e.shiftKey) {
        e.preventDefault();
        const component = components.find(c => c.id === id);
        if (component) {
            let newRotation = (component.rotation - Math.sign(e.deltaY) * 5 + 360) % 360;
            if (component.type === ComponentType.LASER && newRotation === 0) newRotation = 360;
            onUpdateComponent(id, { rotation: newRotation });
        }
      } else {
        handleWheel(e); // Pass wheel event to grid for zooming
      }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType') as ComponentType;
    if (type) {
      const position = screenToWorld(e.clientX, e.clientY);
      onAddComponent(type, position);
    }
  };

  const hitDetectorIds = useMemo(() => {
    const ids = new Set<string>();
    for (const segment of animatedRayPath) {
        for (const detector of components.filter(c => c.type === ComponentType.DETECTOR)) {
            const dx = segment.p2.x - detector.position.x;
            const dy = segment.p2.y - detector.position.y;
            if (Math.sqrt(dx*dx + dy*dy) < (detector.size ?? 1) * 3 * 0.5) {
                ids.add(detector.id);
            }
        }
    }
    return ids;
  }, [animatedRayPath, components]);

  const gridPatternSize = 50;

  return (
    <div className="relative w-full h-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden" onDrop={e => handleDrop(e)} onDragOver={e => e.preventDefault()}>
        <svg
            ref={svgRef}
            className="w-full h-full"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onWheel={handleWheel}
            onClick={() => onSelectComponent(null)}
        >
            <defs>
                <pattern id="grid" width={gridPatternSize} height={gridPatternSize} patternUnits="userSpaceOnUse" x={view.pan.x % gridPatternSize} y={view.pan.y % gridPatternSize}>
                    <path d={`M ${gridPatternSize} 0 L 0 0 0 ${gridPatternSize}`} fill="none" stroke="#e5e7eb" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <g transform={`translate(${view.pan.x}, ${view.pan.y}) scale(${view.zoom})`}>
                {/* Rays */}
                 {animatedRayPath.map(({ p1, p2, intensity }, index) => (
                    <line
                        key={index}
                        x1={p1.x} y1={p1.y}
                        x2={p2.x} y2={p2.y}
                        stroke="#ef4444" // A bright, professional red
                        strokeOpacity={intensity}
                        strokeWidth={0.5 / Math.sqrt(view.zoom)} // Thicker, but still scales
                        strokeLinecap="round"
                    />
                ))}
                {/* Components */}
                {components.map(component => (
                    <OpticalComponent
                        key={component.id}
                        data={component}
                        onPointerDown={handleComponentPointerDown}
                        onClick={(e, id) => {e.stopPropagation(); onSelectComponent(id)}}
                        onWheel={handleComponentWheel}
                        isSelected={component.id === selectedComponentId}
                        isHit={component.type === ComponentType.DETECTOR && hitDetectorIds.has(component.id)}
                    />
                ))}
            </g>
        </svg>
    </div>
  );
};

export default Grid;