/**
 * PARIS EDITION - Metro & RER Infrastructure
 */
import { GeoJsonLayer, TripsLayer, IconLayer } from '@deck.gl/layers';
import { METRO_COLORS } from '../config/geo-paris';

export function createMetroLinesLayer(geoJsonData: any) {
  return new GeoJsonLayer({
    id: 'paris-metro-lines',
    data: geoJsonData,
    getLineColor: d => {
      const line = d.properties.line || d.properties.res_com;
      return METRO_COLORS[line] || [150, 150, 150];
    },
    getLineWidth: 20,
    lineWidthMinPixels: 2,
    pickable: true,
    opacity: 0.8,
    _subLayerProps: {
      'line-strings': {
        billboard: true
      }
    }
  });
}

export function createMetroTripsLayer(tripsData: any[], currentTime: number) {
  return new TripsLayer({
    id: 'paris-metro-trips',
    data: tripsData,
    getPath: d => d.path,
    getTimestamps: d => d.timestamps,
    getColor: d => METRO_COLORS[d.line] || [255, 255, 255],
    opacity: 1,
    widthMinPixels: 4,
    rounded: true,
    trailLength: 180,
    currentTime,
    shadowEnabled: true
  });
}

export function createMetroStationsLayer(stations: any[]) {
  return new IconLayer({
    id: 'paris-metro-stations',
    data: stations,
    getPosition: d => d.coordinates,
    getIcon: d => ({
      url: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="white" stroke="black" stroke-width="2"/></svg>`),
      width: 128,
      height: 128,
      anchorY: 128,
      mask: false
    }),
    getSize: 15,
    sizeMinPixels: 8,
    pickable: true
  });
}
