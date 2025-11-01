export enum ComponentType {
  LASER = 'LASER',
  MIRROR = 'MIRROR',
  CONVEX_LENS = 'CONVEX_LENS',
  CONCAVE_LENS = 'CONCAVE_LENS',
  BEAM_SPLITTER = 'BEAM_SPLITTER',
  DETECTOR = 'DETECTOR',
}

export interface Position {
  x: number;
  y: number;
}

export interface OpticalComponentData {
  id: string;
  type: ComponentType;
  position: Position;
  rotation: number; // in degrees
  size?: number; // size multiplier
  // Type-specific properties
  reflectivity?: number; // 0-1 for Mirror/BeamSplitter
  transmissivity?: number; // 0-1 for BeamSplitter
  focalLength?: number; // for Lenses
  power?: number; // for Laser
  wavelength?: number; // for Laser
}

export interface FrequencySweep {
  start: number;
  stop: number;
  steps: number;
}

export interface GlobalSettings {
  frequencySweep: FrequencySweep;
  scale: number;
}

export interface OpticalSetup {
  components: OpticalComponentData[];
  globalSettings: GlobalSettings;
}

export interface RaySegment {
  p1: Position;
  p2: Position;
  intensity: number;
}


export interface BoundingBox {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}