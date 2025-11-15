import { useState,useEffect,useContext, useRef } from "react"
import ReactMapGL, { Source, Layer, NavigationControl, Popup, Marker, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GeojsonNodeCollection, GeojsonLineString, GeojsonEdgeCollection } from "../interfaces/geometricalobjects";
import { changeLinkGeometries } from "./utilities/curvedlineutilities";
import { assignColorToPathwayMode } from "./utilities/mapdisplayutilities";
import { addCrosshair, removeCrosshair } from "./utilities/crosshairutilities";

const flexibleCircleLayer = {
    id: 'flexible-circle',
    type: 'circle' as const,

    paint: {
        'circle-radius': 4,
        'circle-color': ["get", "displayColor"] as any,
    }
}

const edgeLineLayer = {
    id: 'edge-lines',
    type: 'line' as const,
    paint: {
        'line-color': ["get", "edgeColor"] as any,
        'line-width': 3,
    }
}

const previewEdgeLineLayer = {
    id: 'preview-edge-lines',
    type: 'line' as const,
    paint: {
        'line-color': '#ff0000',
        'line-width': 4,
        'line-dasharray': [2, 2] as any,
    }
}

const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2FuZ2thbmRldiIsImEiOiJjbHgwMmQzbHgwZTg4MnFzZTRsb3d1M2JiIn0.yEH3HF9v9Qdm849tyvMq8Q';

type MapComponentProps = {
    coloredNodes: GeojsonNodeCollection;
    centroid: [number, number];
    edges?: GeojsonEdgeCollection;
    previewEdge?: GeojsonLineString | null;
    startNodeCoord?: [number, number] | null;
    endNodeCoord?: [number, number] | null;
    onClearModel?: () => void;
    hasLocalStorageModel?: boolean;
};

export const MapComponent = ({ coloredNodes, centroid, edges, previewEdge, startNodeCoord, endNodeCoord, onClearModel, hasLocalStorageModel }: MapComponentProps) => {

    const mapRef = useRef<MapRef>(null);

    const [popupInfo, setPopupInfo] = useState<{
        longitude: number;
        latitude: number;
        title: string;
    } | null>(null);

    const [showEdges, setShowEdges] = useState<boolean>(true);

    // Convert edges to GeoJSON format for Mapbox
    // Apply curve transformation to handle overlapping edges
    const edgesGeoJSON = edges ? (() => {
        const transformedEdges = changeLinkGeometries(edges);
        return {
            type: "FeatureCollection",
            features: transformedEdges.Features.map(edge => ({
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: edge.geometry
                },
                properties: {
                    ...edge.properties,
                    edgeColor: assignColorToPathwayMode(edge.properties.mode)
                }
            }))
        };
    })() : null;

    // Convert preview edge to GeoJSON format
    const previewEdgeGeoJSON = previewEdge ? {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: previewEdge.geometry
            },
            properties: previewEdge.properties
        }]
    } : null;

    const handleClick = (event: any) => {
        const feature = event.features?.[0];

        console.log(feature);

        if (feature && feature.layer.id === 'flexible-circle') {
            setPopupInfo({
                longitude: feature.geometry.coordinates[0],
                latitude: feature.geometry.coordinates[1],
                title: `Level ${feature.properties.level}  ${feature.properties.name}`
            });
        }
    };

    const onMouseMove = (event: any) => {
        const feature = event.features?.[0];
        if (feature && feature.layer.id === 'flexible-circle') {
            event.target.getCanvas().style.cursor = 'pointer';
        }
    };

    const onMouseLeave = (event: any) => {
        event.target.getCanvas().style.cursor = '';
    };

    // Effect to manage crosshairs
    useEffect(() => {
        const map = mapRef.current?.getMap();
        if (!map) return;

        // Wait for map to be fully loaded
        if (!map.loaded()) {
            map.on('load', () => {
                updateCrosshairs(map);
            });
        } else {
            updateCrosshairs(map);
        }

        function updateCrosshairs(map: any) {
            // Add/update start node crosshair (red)
            // Size parameter is in degrees - adjust this value for zoom levels 15-20
            // Smaller value = smaller crosshair (try values like 0.00005 to 0.0001)
            if (startNodeCoord) {
                addCrosshair(map, 'start-crosshair', startNodeCoord, '#ff0000', 0.00005);
            } else {
                removeCrosshair(map, 'start-crosshair');
            }

            // Add/update end node crosshair (blue)
            if (endNodeCoord) {
                addCrosshair(map, 'end-crosshair', endNodeCoord, '#0000ff', 0.00005);
            } else {
                removeCrosshair(map, 'end-crosshair');
            }
        }
    }, [startNodeCoord, endNodeCoord]);

    console.log("colored nodes in map component", coloredNodes)
    return (
        <div>
            <ReactMapGL
                ref={mapRef}
                initialViewState={{
                    latitude: centroid[1],
                    longitude: centroid[0],
                    zoom: 17
                }}
                style={{ width: '100%', height: '500px' }}
                //style={dummyStateVariable ? { width: '100%', height: '500px' } : { width: '100%', height: '490px' }}
                //mapStyle={(showSateliteFlag) ? 'mapbox://styles/mapbox/satellite-v9' : 'mapbox://styles/mapbox/streets-v12'}
                mapStyle='mapbox://styles/kangkandev/cm4cerbkh01kk01sdbmmd5svx'
                //mapStyle='mapbox://styles/mapbox/standard'
                mapboxAccessToken={MAPBOX_TOKEN}
                interactiveLayerIds={['flexible-circle']}
                onClick={handleClick}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                customAttribution={"LGL"}
            >

                <NavigationControl position="top-left" />

                {/* Render existing edges */}
                {showEdges && edgesGeoJSON && (
                    <Source id="edges-source" type="geojson" data={edgesGeoJSON}>
                        <Layer {...edgeLineLayer} />
                    </Source>
                )}

                {/* Render preview edge */}
                {previewEdgeGeoJSON && (
                    <Source id="preview-edge-source" type="geojson" data={previewEdgeGeoJSON}>
                        <Layer {...previewEdgeLineLayer} />
                    </Source>
                )}

                {/* Render nodes on top of edges */}
                {coloredNodes && (
                    <Source id="nodes-source" type="geojson" data={coloredNodes}>
                        <Layer {...flexibleCircleLayer} />
                    </Source>
                )}

                {popupInfo && (
                    <Popup
                        longitude={popupInfo.longitude}
                        latitude={popupInfo.latitude}
                        onClose={() => setPopupInfo(null)}
                        closeOnClick={false}
                    >
                        <div>{popupInfo.title}</div>
                    </Popup>
                )}

            </ReactMapGL>

            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button
                    className="btn btn-secondary"
                    onClick={() => setShowEdges(!showEdges)}
                >
                    {showEdges ? 'Hide Edges' : 'Show Edges'}
                </button>

                {hasLocalStorageModel && onClearModel && (
                    <button
                        className="btn btn-danger"
                        onClick={() => {
                            if (window.confirm('Are you sure you want to clear the saved model? This will remove all edges and reset to a clean slate.')) {
                                onClearModel();
                            }
                        }}
                    >
                        Clear Model
                    </button>
                )}
            </div>
        </div>
    )
}