
import React from 'react';

export const LaserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="-10 -6 20 12" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M -8 -4 h 10 v 8 h -10 Z" fill="#f0f0f0" />
    <path d="M 2 -3 h 4 v 6 h -4 Z" fill="#f0f0f0" />
    <line x1="6" y1="0" x2="10" y2="0" stroke="red" strokeWidth="1.5" />
  </svg>
);

export const MirrorIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg className={className} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="0" y1="-10" x2="0" y2="10" />
</svg>
);

export const ConvexLensIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 0 -10 C 8 0, 8 0, 0 10 C -8 0, -8 0, 0 -10 Z" fill="#a5d8ff" fillOpacity="0.7" />
    </svg>
);

export const ConcaveLensIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 0 -10 C -4 0, -4 0, 0 10 C 4 0, 4 0, 0 -10 Z" fill="#a5d8ff" fillOpacity="0.7" />
    </svg>
);

export const BeamSplitterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="-9" y="-9" width="18" height="18" fill="white" />
    <line x1="9" y1="-9" x2="-9" y2="9" strokeWidth="1" strokeDasharray="2 2" />
  </svg>
);

export const DetectorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
     <path d="M -8 2 H 8" />
     <path d="M -6 2 A 6 6 0 0 1 6 2" />
  </svg>
);