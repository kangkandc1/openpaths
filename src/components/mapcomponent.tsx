import { useState,useEffect,useContext } from "react"
import ReactMapGL, { Source, Layer, NavigationControl, Popup, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GeojsonNodeCollection, GeojsonLineString, GeojsonEdgeCollection } from "../interfaces/geometricalobjects";
import { changeLinkGeometries } from "./utilities/curvedlineutilities";

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
        'line-color': '#3887be',
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
};

export const MapComponent = ({ coloredNodes, centroid, edges, previewEdge }: MapComponentProps) => {

    const [popupInfo, setPopupInfo] = useState<{
        longitude: number;
        latitude: number;
        title: string;
    } | null>(null);

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
                properties: edge.properties
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

    console.log("colored nodes in map component", coloredNodes)
    return (<ReactMapGL
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
            {edgesGeoJSON && (
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

    )
}