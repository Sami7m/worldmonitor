/**
 * PARIS EDITION - 3D Buildings Layer
 */
import { Tile3DLayer } from '@deck.gl/geo-layers';

export function createParis3DLayer() {
  return new Tile3DLayer({
    id: 'paris-3d-buildings',
    // Cesium OSM Buildings Tileset (Public Access)
    data: 'https://assets.cesium.com/96188/tileset.json',
    onTileLoad: (tile) => {
      // Custom coloring for the "Spy" theme
      if (tile.content && tile.content.gltf) {
        // Here we could inject custom shaders or materials if needed
      }
    },
    _getMeshColor: [40, 60, 80, 200], // Dark bluish tint for spy theme
    opacity: 0.8,
    pickable: true
  });
}
