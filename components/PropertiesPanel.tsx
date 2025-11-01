import React from 'react';
import { OpticalComponentData, ComponentType } from '../types';

interface PropertiesPanelProps {
  component: OpticalComponentData | null;
  onUpdate: (id: string, updates: Partial<OpticalComponentData>) => void;
  onRemove: (id: string) => void;
}

const PropertyInput: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    {children}
  </div>
);

const NumberInput: React.FC<{ value: number; onChange: (val: number) => void, min?: number, max?: number, step?: number }> = ({ value, onChange, ...props }) => (
    <input
        type="number"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full bg-gray-50 text-gray-900 rounded-md p-2 text-sm border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
        {...props}
    />
);

const SliderInput: React.FC<{ value: number; onChange: (val: number) => void, min?: number, max?: number, step?: number }> = ({ value, onChange, ...props }) => (
    <input
        type="range"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
        {...props}
    />
);

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ component, onUpdate, onRemove }) => {
  if (!component) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 h-full flex items-center justify-center">
        <p className="text-gray-400">Select a component to edit properties</p>
      </div>
    );
  }
  
  const handleUpdate = <K extends keyof OpticalComponentData>(key: K, value: OpticalComponentData[K]) => {
      onUpdate(component.id, { [key]: value });
  };

  const renderComponentProperties = () => {
    switch (component.type) {
      case ComponentType.LASER:
        return (
          <>
            <PropertyInput label="Power (mW)">
              <NumberInput value={component.power ?? 0} onChange={val => handleUpdate('power', val)} min={0} step={1} />
            </PropertyInput>
            <PropertyInput label="Wavelength (nm)">
              <NumberInput value={component.wavelength ?? 0} onChange={val => handleUpdate('wavelength', val)} min={380} max={750} step={10} />
            </PropertyInput>
          </>
        );
      case ComponentType.MIRROR:
        return (
          <PropertyInput label={`Reflectivity: ${Math.round((component.reflectivity ?? 0) * 100)}%`}>
            <SliderInput value={(component.reflectivity ?? 0)} onChange={val => handleUpdate('reflectivity', val)} min={0} max={1} step={0.01} />
          </PropertyInput>
        );
      case ComponentType.CONVEX_LENS:
      case ComponentType.CONCAVE_LENS:
        return (
          <PropertyInput label="Focal Length (grid units)">
            <NumberInput value={component.focalLength ?? 0} onChange={val => handleUpdate('focalLength', val)} min={1} step={0.5} />
          </PropertyInput>
        );
      case ComponentType.BEAM_SPLITTER:
        return (
          <>
            <PropertyInput label={`Reflectivity: ${Math.round((component.reflectivity ?? 0) * 100)}%`}>
              <SliderInput value={(component.reflectivity ?? 0)} onChange={val => handleUpdate('reflectivity', val)} min={0} max={1} step={0.01} />
            </PropertyInput>
            <PropertyInput label={`Transmissivity: ${Math.round((component.transmissivity ?? 0) * 100)}%`}>
              <SliderInput value={(component.transmissivity ?? 0)} onChange={val => handleUpdate('transmissivity', val)} min={0} max={1} step={0.01} />
            </PropertyInput>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 h-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2 capitalize text-gray-900">{component.type.toLowerCase().replace(/_/g, ' ')} Properties</h2>
      <PropertyInput label={`Rotation: ${component.rotation}°`}>
        <SliderInput 
            value={component.rotation} 
            onChange={val => handleUpdate('rotation', val)} 
            min={component.type === ComponentType.LASER ? 1 : 0} 
            max={360} 
        />
      </PropertyInput>
      
      {component.type !== ComponentType.LASER && (
        <PropertyInput label={`Size: ${(component.size ?? 1).toFixed(2)}x`}>
            <SliderInput value={component.size ?? 1} onChange={val => handleUpdate('size', val)} min={0.5} max={3} step={0.1} />
        </PropertyInput>
      )}

      {renderComponentProperties()}
      
      <button 
        onClick={() => onRemove(component.id)} 
        className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
        Delete Component
      </button>
    </div>
  );
};

export default PropertiesPanel;