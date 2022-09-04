import * as geojsonBounds from "geojson-bounds";

/**
 * Zoom into the selected objects
 * @param map mapboxgl.Map
 * @param selectedRecordIds int[]
 * @param features geoJSON[]
 */
export default function zoomSelected(map, selectedRecordIds, features) {
  let base;

  if (selectedRecordIds.length !== 0) {
    let selection = selectedRecordIds
      .map(id => {
        return features.reduce((c, feature) => feature.id === id ? feature : c, null)
      })
      .filter(feature => !!feature);

    if (selection.length === 0 && selectedRecordIds.length === 1) {
      return;
    }

    if (selection.length === 0) {
      selection = features;
    }

    if (selection.length === 1) {
      base = selection[0];
    } else {
      base = {
        type: 'MultiPolygon',
        coordinates: selection.map(feature => geojsonBounds.envelope(feature).geometry.coordinates)
      };
    }
  } else {
    base = {
      type: 'MultiPolygon',
      coordinates: features.map(feature => geojsonBounds.envelope(feature).geometry.coordinates)
    };
  }

  map.fitBounds(geojsonBounds.extent(base), {
    padding: 20,
  });
}
