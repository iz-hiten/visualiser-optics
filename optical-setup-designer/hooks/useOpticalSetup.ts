import { useState, useCallback } from 'react';
import { OpticalSetup, OpticalComponentData, ComponentType, Position, GlobalSettings } from '../types';
import { add, subtract, scale } from '../utils/vector';

const initialSetup: OpticalSetup = {
  components: [
    {
      id: 'initial-laser',
      type: ComponentType.LASER,
      position: { x: 5, y: 15 },
      rotation: 1, // Default to 1 to avoid 0-degree bug
      power: 10,
      wavelength: 635,
      size: 1,
    },
    {
      id: 'initial-mirror',
      type: ComponentType.MIRROR,
      position: { x: 15, y: 15 },
      rotation: 45,
      reflectivity: 1,
      size: 1,
    }
  ],
  globalSettings: {
    frequencySweep: {
      start: 200,
      stop: 400,
      steps: 100,
    },
    scale: 1,
  },
};

export const useOpticalSetup = () => {
  const [setup, setSetup] = useState<OpticalSetup>(initialSetup);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  const addComponent = useCallback((type: ComponentType, position: Position) => {
    const newComponent: OpticalComponentData = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      rotation: type === ComponentType.LASER ? 1 : 0, // Lasers default to 1 degree
      size: 1,
      ...(type === ComponentType.LASER && { power: 5, wavelength: 650 }),
      ...(type === ComponentType.MIRROR && { reflectivity: 0.98 }),
      ...(type === ComponentType.CONVEX_LENS && { focalLength: 10 }),
      ...(type === ComponentType.CONCAVE_LENS && { focalLength: 10 }),
      ...(type === ComponentType.BEAM_SPLITTER && { reflectivity: 0.5, transmissivity: 0.5 }),
    };
    setSetup(prev => ({ ...prev, components: [...prev.components, newComponent] }));
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<OpticalComponentData>) => {
    setSetup(prev => ({
      ...prev,
      components: prev.components.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  }, []);

  const removeComponent = useCallback((id: string) => {
    setSetup(prev => ({ ...prev, components: prev.components.filter(c => c.id !== id) }));
    if(selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  }, [selectedComponentId]);
  
  const replaceComponents = useCallback((newComponents: Omit<OpticalComponentData, 'id'>[]) => {
    const freshComponents = newComponents.map(c => ({
      ...c,
      id: `${c.type}-${Date.now()}-${Math.random()}`
    }));
    setSetup(prev => ({ ...prev, components: freshComponents }));
    setSelectedComponentId(null);
  }, []);

  const updateGlobalSettings = useCallback((updates: Partial<GlobalSettings>) => {
    setSetup(prev => {
        const newSettings = { ...prev.globalSettings, ...updates };

        // Handle scaling logic if scale has changed
        if (updates.scale !== undefined && updates.scale !== prev.globalSettings.scale && prev.components.length > 0) {
            const oldScale = prev.globalSettings.scale;
            const newScale = updates.scale;
            const scaleRatio = newScale / oldScale;

            // 1. Find geometric center of components
            const center = prev.components.reduce(
                (acc, comp) => add(acc, comp.position),
                { x: 0, y: 0 }
            );
            center.x /= prev.components.length;
            center.y /= prev.components.length;
            
            // 2. Scale positions of all components relative to the center
            const newComponents = prev.components.map(comp => {
                const vecFromCenter = subtract(comp.position, center);
                const scaledVec = scale(vecFromCenter, scaleRatio);
                const newPosition = add(center, scaledVec);
                return { ...comp, position: newPosition };
            });
            return { ...prev, globalSettings: newSettings, components: newComponents };
        }
        
        return { ...prev, globalSettings: newSettings };
    });
  }, []);

  const selectedComponent = setup.components.find(c => c.id === selectedComponentId) || null;

  return {
    setup,
    selectedComponent,
    selectedComponentId,
    setSelectedComponentId,
    addComponent,
    updateComponent,
    removeComponent,
    updateGlobalSettings,
    replaceComponents,
  };
};