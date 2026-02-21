/**
 * PARIS SENTINEL - ZERO CONFIG DATA LOADER
 * Uses public OpenData sources that don't require API keys.
 */
import { PARIS_CENTER } from '../config/geo-paris';

export interface ParisSentinelData {
  traffic: any[];
  metroLines: any;
  metroTrips: any[];
  metroStations: any[];
  cameras: any[];
}

/**
 * Main loader - Parallel fetching from public sources
 */
export async function loadParisSentinelData(): Promise<ParisSentinelData> {
  console.log('[Paris Sentinel] Initializing Zero-Config Data Stream...');
  
  const results = await Promise.allSettled([
    fetchPublicTraffic(),
    fetchLocalMetroLines(),
    fetchLocalMetroStations(),
    fetchPublicTransportStatus()
  ]);

  const [traffic, metroLines, metroStations, transportStatus] = results.map(r => r.status === 'fulfilled' ? r.value : null);

  return {
    traffic: traffic || [],
    metroLines: metroLines,
    metroTrips: [], // TripsLayer requires complex Navitia auth, kept for future expansion
    metroStations: metroStations || [],
    cameras: getSytadinPublicCameras()
  };
}

/**
 * Real-time Traffic via Paris OpenData (No Key Required)
 * Dataset: "comptages-routiers-reels"
 */
async function fetchPublicTraffic() {
  try {
    // API v2.1 of OpenData Paris - Public access
    const url = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/comptages-routiers-reels/records?limit=50';
    const response = await fetch(url);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.results.map((r: any) => ({
      path: [
        [r.coordinates.lon, r.coordinates.lat], 
        [r.coordinates.lon + 0.0005, r.coordinates.lat + 0.0005]
      ],
      // Logic: if occupation > 10% it's heavy, > 5% busy
      status: r.taux_occupation > 10 ? 'heavy' : (r.taux_occupation > 4 ? 'busy' : 'fluid'),
      speed: r.debit_horaire,
      label: r.libelle
    }));
  } catch (e) {
    console.warn('[Paris Sentinel] Public traffic fetch failed');
    return [];
  }
}

/**
 * Transport Status via RATP/IDFM public alerts (No Key)
 */
async function fetchPublicTransportStatus() {
  try {
    // Using a public proxy or open endpoint for RATP alerts if available
    // For now, we return null to avoid breaking the UI
    return null;
  } catch (e) {
    return null;
  }
}

async function fetchLocalMetroLines() {
  return fetch('/data/paris/metro-lines.geojson').then(r => r.ok ? r.json() : null).catch(() => null);
}

async function fetchLocalMetroStations() {
  return fetch('/data/paris/metro-stations.json').then(r => r.ok ? r.json() : []).catch(() => []);
}

/**
 * Direct JPG streams from Sytadin (Publicly accessible)
 */
function getSytadinPublicCameras() {
  // These URLs are standard Sytadin camera endpoints
  return [
    { id: 'cam-périph-a1', lat: 48.901, lon: 2.355, title: 'Porte de la Chapelle (A1)', url: 'https://www.sytadin.fr/m/cameras/cam01.jpg' },
    { id: 'cam-périph-a13', lat: 48.845, lon: 2.251, title: 'Porte d\'Auteuil (A13)', url: 'https://www.sytadin.fr/m/cameras/cam13.jpg' },
    { id: 'cam-périph-italie', lat: 48.819, lon: 2.361, title: 'Porte d\'Italie', url: 'https://www.sytadin.fr/m/cameras/cam07.jpg' },
    { id: 'cam-périph-bercy', lat: 48.828, lon: 2.385, title: 'Porte de Bercy', url: 'https://www.sytadin.fr/m/cameras/cam06.jpg' },
    { id: 'cam-périph-maillot', lat: 48.877, lon: 2.282, title: 'Porte Maillot', url: 'https://www.sytadin.fr/m/cameras/cam14.jpg' }
  ];
}

export function isParisMode(): boolean {
  return import.meta.env.VITE_FOCUS_PARIS === 'true';
}
