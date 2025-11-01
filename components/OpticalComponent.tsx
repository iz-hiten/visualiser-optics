
import React from 'react';
import { OpticalComponentData, ComponentType } from '../types';

interface OpticalComponentProps {
  data: OpticalComponentData;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  onClick: (e: React.MouseEvent, id: string) => void;
  onWheel: (e: React.WheelEvent, id: string) => void;
  isSelected: boolean;
  isHit?: boolean;
}

const ComponentVisual: React.FC<{ data: OpticalComponentData, isSelected: boolean, isHit?: boolean }> = ({ data, isSelected, isHit }) => {
    const { type, size = 1 } = data;
    const baseClasses = "transition-colors duration-200";
    const selectedStroke = "stroke-accent";
    const unselectedStroke = "stroke-black";
    
    const strokeClass = isSelected ? selectedStroke : unselectedStroke;
    const className = `${baseClasses} ${strokeClass}`;

    const visualSize = 3 * size;

    const baseProps = {
        strokeWidth: isSelected ? "0.2" : "0.15",
        vectorEffect: "non-scaling-stroke",
    };

    switch (type) {
        case ComponentType.LASER:
            return (
                <g className={className} fill="none">
                    <path d={`M ${-visualSize*0.6} ${-visualSize*0.3} h ${visualSize*0.7} v ${visualSize*0.6} h ${-visualSize*0.7} Z`} {...baseProps} fill={isSelected ? "#fafafa" : "#f0f0f0"} />
                    <path d={`M ${visualSize*0.1} ${-visualSize*0.2} h ${visualSize*0.3} v ${visualSize*0.4} h ${-visualSize*0.3} Z`} {...baseProps} fill={isSelected ? "#fafafa" : "#f0f0f0"} />
                </g>
            );
        case ComponentType.MIRROR:
             return (
                 <g className={className}>
                    <line x1="0" y1={-visualSize/2} x2="0" y2={visualSize/2} {...baseProps} strokeWidth="0.4" />
                </g>
            );
        case ComponentType.CONVEX_LENS:
             return (
                <g className={className}>
                    <path d={`M 0 ${-visualSize/2} C ${visualSize*0.8} 0, ${visualSize*0.8} 0, 0 ${visualSize/2} C ${-visualSize*0.8} 0, ${-visualSize*0.8} 0, 0 ${-visualSize/2} Z`} {...baseProps} fill="#a5d8ff" fillOpacity="0.7" />
                </g>
             );
        case ComponentType.CONCAVE_LENS:
            return (
                <g className={className}>
                    <path d={`M 0 ${-visualSize/2} C ${-visualSize*0.4} 0, ${-visualSize*0.4} 0, 0 ${visualSize/2} C ${visualSize*0.4} 0, ${visualSize*0.4} 0, 0 ${-visualSize/2} Z`} {...baseProps} fill="#a5d8ff" fillOpacity="0.7" />
                </g>
            );
        case ComponentType.BEAM_SPLITTER:
            const d = visualSize / 2;
            return (
                <g className={className}>
                    <rect x={-d} y={-d} width={d*2} height={d*2} {...baseProps} fill="white" />
                    <line x1={d} y1={-d} x2={-d} y2={d} strokeWidth="0.1" vectorEffect="non-scaling-stroke" strokeDasharray="0.3 0.3" />
                </g>
            );
        case ComponentType.DETECTOR:
            const detectorRadius = visualSize / 3;
            const detectorBase = visualSize / 2;
            const detectorStroke = isHit ? "stroke-green-500" : strokeClass;
            const detectorClassName = `${baseClasses} ${detectorStroke}`;
            return (
                <g className={detectorClassName} fill="none">
                    <path d={`M ${-detectorBase/2} 0 H ${detectorBase/2}`} {...baseProps} />
                    <path d={`M ${-detectorRadius} 0 A ${detectorRadius} ${detectorRadius} 0 0 1 ${detectorRadius} 0`} {...baseProps} />
                </g>
            );
        default:
            return null;
    }
};

const OpticalComponent: React.FC<OpticalComponentProps> = ({ data, onPointerDown, onClick, onWheel, isSelected, isHit }) => {
  const { id, position, rotation } = data;

  return (
    <g
      transform={`translate(${position.x}, ${position.y}) rotate(${rotation})`}
      onPointerDown={(e) => onPointerDown(e, id)}
      onClick={(e) => onClick(e, id)}
      onWheel={(e) => onWheel(e, id)}
      style={{ cursor: 'grab' }}
      className="select-none"
    >
      <ComponentVisual data={data} isSelected={isSelected} isHit={isHit} />
    </g>
  );
};

export default OpticalComponent;