import { Position, OpticalComponentData, BoundingBox } from '../types';

export const subtract = (v1: Position, v2: Position): Position => ({ x: v1.x - v2.x, y: v1.y - v2.y });
export const add = (v1: Position, v2: Position): Position => ({ x: v1.x + v2.x, y: v1.y + v2.y });
export const scale = (v: Position, s: number): Position => ({ x: v.x * s, y: v.y * s });

export const calculateBoundingBox = (components: OpticalComponentData[]): BoundingBox => {
    if (components.length === 0) {
        return { minX: 0, minY: 0, maxX: 10, maxY: 10 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const component of components) {
        const size = (component.size ?? 1) * 2;
        minX = Math.min(minX, component.position.x - size);
        minY = Math.min(minY, component.position.y - size);
        maxX = Math.max(maxX, component.position.x + size);
        maxY = Math.max(maxY, component.position.y + size);
    }
    
    return { minX, minY, maxX, maxY };
};