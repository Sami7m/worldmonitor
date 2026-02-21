/**
 * PARIS EDITION - Central data loader
 */
import { PARIS_CENTER } from '../config/geo-paris';
import { fetchParisTraffic } from './paris-roads';

export interface ParisSentinelData {
  traffic: any[];
  metroLines: any;
  metroTrips: any[];
  metroStations: any[];
  cameras: any[];
}

export async function loadParisSentinelData(): Promise<ParisSentinelData> {
  // Parallel loading of all Paris data sources
  const [traffic, metroLines, metroStations] = await Promise.all([
    fetchParisTraffic(),
    fetch('/data/paris/metro-lines.geojson').then(r => r.ok ? r.json() : null).catch(() => null),
    fetch('/data/paris/metro-stations.json').then(r => r.ok ? r.json() : []).catch(() => [])
  ]);

  // Mock cameras for initial development
  const cameras = [
    { id: 'cam-01', lat: 48.87, lon: 2.29, title: 'Arc de Triomphe', url: 'https://camera-stream-mock.com/01' },
    { id: 'cam-02', lat: 48.86, lon: 2.33, title: 'Louvre', url: 'https://camera-stream-mock.com/02' }
  ];

  return {
    traffic,
    metroLines,
    metroTrips: [], // Real-time trips would be calculated from Navitia
    metroStations,
    cameras
  };
}

export function isParisMode(): boolean {
  return import.meta.env.VITE_FOCUS_PARIS === 'true';
}
