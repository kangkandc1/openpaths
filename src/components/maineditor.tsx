import { useEffect, useState, useContext } from "react";
import { useStationContext } from "../services/stationserviceprovider";
import { getStationCentroid } from "./utilities/geospatialutilities";
import { assignColorToLevel } from "./utilities/mapdisplayutilities";
import { GeojsonPoint, GeojsonNodeCollection, GeojsonLineString } from "../interfaces/geometricalobjects";
import { RotatingLines } from "react-loader-spinner"
import { MapComponent } from "./mapcomponent";
import { LinkCreator } from "./linkcreator";
import { useHistory } from "react-router-dom";

export const MainEditor: React.FC = () => {

    const history = useHistory();
    const { collection, addNode, addEdge, getAllNodes, setStation, setStationModel, getAllEdges, getStationModel, saveModelToLocalStorage, clearModelFromLocalStorage, hasLocalStorageModel } = useStationContext();
    const [egdesGeojson, setEdgesGeojson] = useState(getAllEdges());
    const [nodesGeojson, setNodesGeojson] = useState(getAllNodes());
    const [stationCentroid, setStationCentroid] = useState();
    const [loading, setLoading] = useState(true);
    const [previewEdge, setPreviewEdge] = useState<GeojsonLineString | null>(null);
    const [startNodeCoord, setStartNodeCoord] = useState<[number, number] | null>(null);
    const [endNodeCoord, setEndNodeCoord] = useState<[number, number] | null>(null);

    console.log(getStationCentroid(getStationModel().nodes))

    console.log(getStationModel());

    // Check if station model is properly initialized
    useEffect(() => {
        const stationModel = getStationModel();
        if (!stationModel?.id || !stationModel?.label) {
            console.warn("Station model not initialized, redirecting to landing page");
            history.push("/landing");
            return;
        }

        const t = setTimeout(() => setLoading(false), 2000); // 2 seconds
        return () => clearTimeout(t);
    }, []);

    // Warn user before page refresh to prevent data loss
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = ''; // Modern browsers require this
            return ''; // Some browsers use the return value
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const coloredNodes = { "type": "FeatureCollection", "features": [] as GeojsonPoint[] };

    getStationModel().nodes.features.forEach((node) => {
        const level = node.properties.level;
        const color = assignColorToLevel(level);
        const coloredNode = {
            ...node,
            properties: {
                ...node.properties,
                displayColor: color
            }
        };
        coloredNodes.features.push(coloredNode);
    });




    const coloredNodesGeojson: GeojsonNodeCollection = {
        type: "FeatureCollection",
        features: coloredNodes.features,
    };

    const centroid = getStationCentroid(getStationModel().nodes);


    const currentMapProps = {
        coloredNodes: coloredNodesGeojson,
        centroid: [centroid.lon, centroid.lat]
    }

    const handleLinkPreview = (link: GeojsonLineString | null) => {
        setPreviewEdge(link);
    };

    const handleLinkCreate = (link: GeojsonLineString) => {
        // Add the edge using the StationService
        addEdge(link);
        setEdgesGeojson(getAllEdges());
        setPreviewEdge(null);
        console.log("Link created:", link);
    };

    const handleNodeSelection = (startCoord: [number, number] | null, endCoord: [number, number] | null) => {
        setStartNodeCoord(startCoord);
        setEndNodeCoord(endCoord);
    };

    const handleSaveModel = () => {
        saveModelToLocalStorage();
        alert("Model saved to local storage!");
    };

    const handleClearModel = () => {
        clearModelFromLocalStorage();
        setEdgesGeojson(getAllEdges());
        alert("Model cleared! Starting with a clean slate.");
    };

    return (
        <div className="container-fluid">
            <div className="row mt-2">
                <div className="col-md-12">
                    <h2>You are modelling {getStationModel().label}</h2>
                </div>
            </div>

            <div className="row mt-2">
                <div className="col-md-12">
                    <button className="btn btn-success" onClick={handleSaveModel}>
                        Save Model
                    </button>
                </div>
            </div>

            <div className="row mt-2">
                <div className="col-md-8">
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                            <RotatingLines
                                strokeColor="grey"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="96"
                                visible={true}
                            />
                        </div>
                    ) : (
                        <MapComponent
                            coloredNodes={coloredNodesGeojson}
                            centroid={[centroid.lon, centroid.lat]}
                            edges={egdesGeojson}
                            previewEdge={previewEdge}
                            startNodeCoord={startNodeCoord}
                            endNodeCoord={endNodeCoord}
                            onClearModel={handleClearModel}
                            hasLocalStorageModel={hasLocalStorageModel()}
                        />
                    )}
                </div>

                <div className="col-md-4">
                    {!loading && (
                        <LinkCreator
                            onLinkPreview={handleLinkPreview}
                            onLinkCreate={handleLinkCreate}
                            onNodeSelection={handleNodeSelection}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}