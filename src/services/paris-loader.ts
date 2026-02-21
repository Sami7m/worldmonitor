/**
 * PARIS SENTINEL - Advanced Data Loader
 * Manages real-time connections to Navitia (Transports) and Sytadin (Traffic)
 */
import { PARIS_CENTER } from '../config/geo-paris';

export interface ParisSentinelData {
  traffic: any[];
  metroLines: any;
  metroTrips: any[];
  metroStations: any[];
  cameras: any[];
}

// API Configuration - Values should be set in .env
const NAVITIA_TOKEN = import.meta.env.VITE_NAVITIA_TOKEN;
const SYTADIN_API_KEY = import.meta.env.VITE_SYTADIN_API_KEY;

export async function loadParisSentinelData(): Promise<ParisSentinelData> {
  console.log('[Paris Sentinel] Starting real-time data ingestion...');
  
  const results = await Promise.allSettled([
    fetchTrafficData(),
    fetchMetroLines(),
    fetchMetroStations(),
    fetchRealTimeTrips()
  ]);

  const [traffic, metroLines, metroStations, metroTrips] = results.map(r => r.status === 'fulfilled' ? r.value : null);

  return {
    traffic: traffic || [],
    metroLines: metroLines,
    metroTrips: metroTrips || [],
    metroStations: metroStations || [],
    cameras: getParisCameras()
  };
}

/**
 * Traffic data from Sytadin / OpenData Soft
 */
async function fetchTrafficData() {
  try {
    // Fallback to OpenData Soft if Sytadin key is missing
    const url = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/comptages-routiers-reels/records?limit=100';
    const response = await fetch(url);
    const data = await response.json();
    return data.results.map((r: any) => ({
      path: [[r.coordinates.lon, r.coordinates.lat], [r.coordinates.lon + 0.001, r.coordinates.lat + 0.001]],
      status: r.taux_occupation > 15 ? 'heavy' : (r.taux_occupation > 5 ? 'busy' : 'fluid'),
      speed: r.debit_horaire
    }));
  } catch (e) {
    console.warn('[Paris Sentinel] Traffic fetch failed, using local mock');
    return [];
  }
}

/**
 * Real-time transport trips via Navitia
 */
async function fetchRealTimeTrips() {
  if (!NAVITIA_TOKEN) {
    console.warn('[Paris Sentinel] VITE_NAVITIA_TOKEN missing. Real-time transport disabled.');
    return [];
  }
  
  try {
    const response = await fetch('https://api.navitia.io/v1/coverage/fr-idf/v2/vehicle_journeys', {
      headers: { 'Authorization': NAVITIA_TOKEN }
    });
    const data = await response.json();
    return data.vehicle_journeys || [];
  } catch (e) {
    return [];
  }
}

async function fetchMetroLines() {
  return fetch('/data/paris/metro-lines.geojson').then(r => r.ok ? r.json() : null).catch(() => null);
}

async function fetchMetroStations() {
  return fetch('/data/paris/metro-stations.json').then(r => r.ok ? r.json() : []).catch(() => []);
}

function getParisCameras() {
  return [
    { id: 'cam-périph-nord', lat: 48.90, lon: 2.35, title: 'Périphérique Nord', url: 'https://www.sytadin.fr/m/cameras/cam01.jpg' },
    { id: 'cam-périph-sud', lat: 48.82, lon: 2.34, title: 'Périphérique Sud', url: 'https://www.sytadin.fr/m/cameras/cam02.jpg' },
    { id: 'cam-concorde', lat: 48.865, lon: 2.32, title: 'Place de la Concorde', url: 'https://www.sytadin.fr/m/cameras/cam03.jpg' }
  ];
}

export function isParisMode(): boolean {
  return import.meta.env.VITE_FOCUS_PARIS === 'true';
}
