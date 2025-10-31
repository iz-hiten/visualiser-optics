import React, { useState, useCallback } from 'react';
import Grid from './components/Grid';
import ComponentPalette from './components/ComponentPalette';
import PropertiesPanel from './components/PropertiesPanel';
import Controls from './components/Controls';
import AIControl from './components/AIControl';
import { useOpticalSetup } from './hooks/useOpticalSetup';
import { OpticalComponentData, BoundingBox, Position } from './types';
import { calculateBoundingBox } from './utils/vector';


const App: React.FC = () => {
  const {
    setup,
    selectedComponent,
    setSelectedComponentId,
    addComponent,
    updateComponent,
    removeComponent,
    updateGlobalSettings,
    replaceComponents,
  } = useOpticalSetup();

  const [view, setView] = useState({ pan: { x: 0, y: 0 }, zoom: 32 });

  const fitViewToComponents = useCallback((components: OpticalComponentData[], viewport: {width: number, height: number}) => {
    if (components.length === 0) return;

    const bbox = calculateBoundingBox(components);
    const bboxWidth = bbox.maxX - bbox.minX;
    const bboxHeight = bbox.maxY - bbox.minY;

    if (bboxWidth === 0 || bboxHeight === 0) return;

    const padding = 50; // pixels
    const effectiveWidth = viewport.width - padding * 2;
    const effectiveHeight = viewport.height - padding * 2;
    
    const zoomX = effectiveWidth / bboxWidth;
    const zoomY = effectiveHeight / bboxHeight;
    const newZoom = Math.min(zoomX, zoomY, 100); // Cap max zoom

    const newPanX = (viewport.width / 2) - (bboxWidth / 2 + bbox.minX) * newZoom;
    const newPanY = (viewport.height / 2) - (bboxHeight / 2 + bbox.minY) * newZoom;

    setView({ pan: { x: newPanX, y: newPanY }, zoom: newZoom });
  }, []);

  const handleAiGenerated = useCallback((components: Omit<OpticalComponentData, 'id'>[]) => {
    // Generate full component data to calculate bounding box
    const fullComponents = components.map(c => ({...c, id: ''}));
    replaceComponents(components);

    // Find the grid viewport for accurate centering
    const gridElement = document.querySelector('main'); // The main container for the grid
    if (gridElement) {
        const { width, height } = gridElement.getBoundingClientRect();
        fitViewToComponents(fullComponents, { width, height });
    }
  }, [replaceComponents, fitViewToComponents]);


  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col p-4 font-sans">
      <header className="mb-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Optical Setup Designer</h1>
        <p className="text-gray-500">A research-grade tool for designing and visualizing optical systems.</p>
      </header>
      
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ height: 'calc(100vh - 100px)' }}>
        <aside className="lg:col-span-1 flex flex-col gap-4">
            <ComponentPalette />
            <AIControl onGenerated={handleAiGenerated} />
            <Controls 
                globalSettings={setup.globalSettings} 
                onUpdate={updateGlobalSettings} 
                fullSetup={setup}
            />
        </aside>

        <main className="lg:col-span-2 h-full">
          <Grid
            components={setup.components}
            selectedComponentId={selectedComponent?.id || null}
            onAddComponent={addComponent}
            onUpdateComponent={updateComponent}
            onSelectComponent={setSelectedComponentId}
            view={view}
            setView={setView}
          />
        </main>

        <aside className="lg:col-span-1">
          <PropertiesPanel
            component={selectedComponent}
            onUpdate={updateComponent}
            onRemove={removeComponent}
          />
        </aside>
      </div>
    </div>
  );
};

export default App;