import type { Map as MapboxMap } from 'mapbox-gl';

/**
 * Adds a crosshair (vertical and horizontal lines) at a specific coordinate
 * @param map The Mapbox map instance
 * @param id Unique identifier for the crosshair
 * @param coord The coordinate [longitude, latitude]
 * @param color The color of the crosshair (default: red)
 * @param size The size of the crosshair lines (default: 0.0005)
 */
export function addCrosshair(
  map: MapboxMap,
  id: string,
  coord: [number, number],
  color: string = "#ff0000",
  size: number = 0.000000001
) {
  const [lng, lat] = coord;

  const horizontal = {
    type: "Feature" as const,
    geometry: {
      type: "LineString" as const,
      coordinates: [
        [lng - size, lat],
        [lng + size, lat],
      ],
    },
    properties: {}
  };

  const vertical = {
    type: "Feature" as const,
    geometry: {
      type: "LineString" as const,
      coordinates: [
        [lng, lat - size],
        [lng, lat + size],
      ],
    },
    properties: {}
  };

  // Check if source already exists and remove it
  if (map.getSource(id)) {
    if (map.getLayer(id)) {
      map.removeLayer(id);
    }
    map.removeSource(id);
  }

  map.addSource(id, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [horizontal, vertical],
    },
  });

  map.addLayer({
    id,
    type: "line",
    source: id,
    paint: {
      "line-color": color,
      "line-width": 2,
    },
  });
}

/**
 * Removes a crosshair from the map
 * @param map The Mapbox map instance
 * @param id The identifier of the crosshair to remove
 */
export function removeCrosshair(map: MapboxMap, id: string) {
  if (map.getLayer(id)) {
    map.removeLayer(id);
  }
  if (map.getSource(id)) {
    map.removeSource(id);
  }
}
