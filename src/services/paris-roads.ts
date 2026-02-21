/**
 * PARIS EDITION - Road Network & Real-time Traffic
 */
import { PathLayer } from '@deck.gl/layers';

export interface TrafficSegment {
  path: [number, number][];
  speed: number;
  status: 'fluid' | 'busy' | 'heavy' | 'blocked';
}

export function createParisRoadLayer(segments: TrafficSegment[]) {
  return new PathLayer({
    id: 'paris-traffic-layer',
    data: segments,
    getPath: d => d.path,
    getColor: d => {
      switch (d.status) {
        case 'busy': return [255, 165, 0];
        case 'heavy': return [255, 68, 68];
        case 'blocked': return [150, 0, 0];
        default: return [0, 242, 255, 150]; // Cyan fluid
      }
    },
    getWidth: 15,
    widthMinPixels: 2,
    pickable: true,
    rounded: true,
    shadowEnabled: true,
    _pathType: 'flat'
  });
}

// Mock data generator for initial development
export function fetchParisTraffic(): Promise<TrafficSegment[]> {
  // In a real scenario, we'd fetch from Sytadin / DiRIF
  return Promise.resolve([
    { path: [[2.25, 48.88], [2.3, 48.89], [2.35, 48.88]], speed: 70, status: 'fluid' },
    { path: [[2.35, 48.88], [2.4, 48.87], [2.45, 48.85]], speed: 20, status: 'heavy' }
  ]);
}
