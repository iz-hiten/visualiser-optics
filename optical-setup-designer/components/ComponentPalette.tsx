import React from 'react';
import { ComponentType } from '../types';
import { LaserIcon, MirrorIcon, BeamSplitterIcon, DetectorIcon, ConvexLensIcon, ConcaveLensIcon } from './icons';

interface PaletteItemProps {
  type: ComponentType;
  label: string;
  icon: React.ReactNode;
}

const PaletteItem: React.FC<PaletteItemProps> = ({ type, label, icon }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('componentType', type);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex flex-col items-center p-3 bg-white rounded-lg cursor-grab hover:bg-gray-100 transition-colors duration-200 text-center border border-gray-200"
      title={`Drag to add a ${label}`}
    >
      <div className="w-8 h-8 text-gray-800">{icon}</div>
      <span className="text-xs mt-2 text-gray-600">{label}</span>
    </div>
  );
};

const ComponentPalette: React.FC = () => {
  const components = [
    { type: ComponentType.LASER, label: 'Laser', icon: <LaserIcon /> },
    { type: ComponentType.MIRROR, label: 'Mirror', icon: <MirrorIcon /> },
    { type: ComponentType.CONVEX_LENS, label: 'Convex Lens', icon: <ConvexLensIcon /> },
    { type: ComponentType.CONCAVE_LENS, label: 'Concave Lens', icon: <ConcaveLensIcon /> },
    { type: ComponentType.BEAM_SPLITTER, label: 'Splitter', icon: <BeamSplitterIcon /> },
    { type: ComponentType.DETECTOR, label: 'Detector', icon: <DetectorIcon /> },
  ];

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-lg font-bold mb-4 text-center border-b border-gray-200 pb-2 text-gray-900">Components</h2>
      <div className="grid grid-cols-2 gap-3">
        {components.map(comp => (
          <PaletteItem key={comp.type} {...comp} />
        ))}
      </div>
    </div>
  );
};

export default ComponentPalette;