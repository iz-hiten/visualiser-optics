import React from 'react';
import { GlobalSettings, FrequencySweep, OpticalSetup } from '../types';

interface ControlsProps {
  globalSettings: GlobalSettings;
  onUpdate: (updates: Partial<GlobalSettings>) => void;
  fullSetup: OpticalSetup;
}

const ControlInput: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    {children}
  </div>
);

const NumberInput: React.FC<{ value: number; onChange: (val: number) => void, step?: number, min?: number, max?: number }> = ({ value, onChange, ...props }) => (
    <input
        type="number"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full bg-gray-50 text-gray-900 rounded-md p-2 text-sm border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
        {...props}
    />
);

const Controls: React.FC<ControlsProps> = ({ globalSettings, onUpdate, fullSetup }) => {

  const handleDownloadJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(fullSetup, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'optical-setup.json';
    link.click();
  };
  
  const handleSweepUpdate = (key: keyof FrequencySweep, value: number) => {
    onUpdate({
        frequencySweep: {
            ...globalSettings.frequencySweep,
            [key]: value
        }
    });
  };

  const handleScaleUpdate = (newScale: number) => {
    onUpdate({ scale: newScale });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2 text-gray-900">Global Controls</h2>
      
      <ControlInput label={`Layout Scale: ${globalSettings.scale.toFixed(2)}x`}>
        <input
            type="range"
            value={globalSettings.scale}
            onChange={e => handleScaleUpdate(parseFloat(e.target.value))}
            min="0.25"
            max="4"
            step="0.05"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
        />
      </ControlInput>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-md font-semibold mb-2 text-gray-800">Frequency Sweep (THz)</h3>
        <div className="grid grid-cols-2 gap-3">
            <ControlInput label="Start">
                <NumberInput value={globalSettings.frequencySweep.start} onChange={v => handleSweepUpdate('start', v)} step={10} />
            </ControlInput>
             <ControlInput label="Stop">
                <NumberInput value={globalSettings.frequencySweep.stop} onChange={v => handleSweepUpdate('stop', v)} step={10} />
            </ControlInput>
        </div>
        <ControlInput label="Number of Points">
            <NumberInput value={globalSettings.frequencySweep.steps} onChange={v => handleSweepUpdate('steps', v)} min={2} step={1} />
        </ControlInput>
      </div>
      
      <button 
        onClick={handleDownloadJson}
        className="w-full mt-4 bg-accent hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
      >
        Download JSON
      </button>
    </div>
  );
};

export default Controls;